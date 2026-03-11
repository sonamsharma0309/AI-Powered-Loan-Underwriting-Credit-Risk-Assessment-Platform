from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import bcrypt
import joblib
import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

from model_metrics import get_model_metrics, get_fairness_metrics

app = Flask(__name__)
CORS(app)

limiter = Limiter(get_remote_address, app=app)

model = joblib.load("models/risk_model_optimized.pkl")


# -----------------------------
# SECURITY HEADERS
# -----------------------------
@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


# -----------------------------
# DATABASE
# -----------------------------
def get_db():
    conn = sqlite3.connect("creditai.db")
    conn.row_factory = sqlite3.Row
    return conn


# -----------------------------
# DATABASE INIT
# -----------------------------
def init_db():

    conn = get_db()

    conn.execute("""
    CREATE TABLE IF NOT EXISTS applications(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        income REAL,
        loan REAL,
        decision TEXT,
        risk REAL
    )
    """)

    conn.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()


@app.route("/")
def home():
    return jsonify({"message": "CreditAI Backend Running"})


# -----------------------------
# REGISTER
# -----------------------------
@app.route("/register", methods=["POST"])
@limiter.limit("10 per minute")
def register():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    if user:
        conn.close()
        return jsonify({"success": False, "message": "User already exists"})

    conn.execute(
        "INSERT INTO users(email,password) VALUES (?,?)",
        (email, hashed_password)
    )

    conn.commit()
    conn.close()

    return jsonify({"success": True})


# -----------------------------
# LOGIN
# -----------------------------
@app.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    conn.close()

    if user and check_password_hash(user["password"], password):
        return jsonify({
            "success": True,
            "token": "creditai-user"
        })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })


# -----------------------------
# LOAN PREDICTION
# -----------------------------
@app.route("/predict", methods=["POST"])
@limiter.limit("20 per minute")
def predict():

    data = request.json

    name = data.get("name")
    age = data.get("age")
    income = data.get("income")
    loan = data.get("loanAmount")
    credit = data.get("creditHistory")

    if not name or age is None or income is None or loan is None or credit is None:
        return jsonify({"error": "Missing required fields"}), 400

    age = float(age)
    income = float(income)
    loan = float(loan)
    credit = float(credit)

    if age < 18:
        return jsonify({"error": "Applicant must be at least 18"}), 400

    if income <= 0 or loan <= 0:
        return jsonify({"error": "Income and loan must be positive"}), 400

    loan_percent_income = loan / income

    row = {
        "person_age": age,
        "person_income": income,
        "person_emp_length": 5,
        "loan_amnt": loan,
        "loan_int_rate": credit,
        "loan_percent_income": loan_percent_income,
        "cb_person_cred_hist_length": 5,
        "loan_to_income_ratio": loan_percent_income,
        "interest_income_ratio": credit / income,

        "person_home_ownership_OTHER": 0,
        "person_home_ownership_OWN": 0,
        "person_home_ownership_RENT": 1,

        "loan_intent_EDUCATION": 0,
        "loan_intent_HOMEIMPROVEMENT": 0,
        "loan_intent_MEDICAL": 0,
        "loan_intent_PERSONAL": 1,
        "loan_intent_VENTURE": 0,

        "loan_grade_B": 0,
        "loan_grade_C": 0,
        "loan_grade_D": 0,
        "loan_grade_E": 0,
        "loan_grade_F": 0,
        "loan_grade_G": 0,

        "cb_person_default_on_file_Y": 0
    }

    df = pd.DataFrame([row])

    prob = float(model.predict_proba(df)[0][1])

    prediction = 1 if prob >= 0.4 else 0

    risk_score = round(prob * 100, 2)
    approval_probability = round((1 - prob) * 100, 2)

    decision = "Approved" if prediction == 0 else "Rejected"

    conn = get_db()

    conn.execute(
        "INSERT INTO applications(name,age,income,loan,decision,risk) VALUES (?,?,?,?,?,?)",
        (name, age, income, loan, decision, risk_score)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "risk_score": risk_score,
        "approval_probability": approval_probability,
        "decision": decision
    })


# -----------------------------
# APPLICATION LIST
# -----------------------------
@app.route("/applications")
def applications():

    conn = get_db()

    rows = conn.execute(
        "SELECT * FROM applications ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# -----------------------------
# ANALYTICS
# -----------------------------
@app.route("/analytics")
def analytics():

    conn = get_db()

    total = conn.execute("SELECT COUNT(*) as c FROM applications").fetchone()["c"]

    approved = conn.execute(
        "SELECT COUNT(*) as c FROM applications WHERE decision='Approved'"
    ).fetchone()["c"]

    rejected = conn.execute(
        "SELECT COUNT(*) as c FROM applications WHERE decision='Rejected'"
    ).fetchone()["c"]

    avg_risk = conn.execute(
        "SELECT AVG(risk) as r FROM applications"
    ).fetchone()["r"]

    conn.close()

    return jsonify({
        "total": total,
        "approved": approved,
        "rejected": rejected,
        "avg_risk": avg_risk or 0
    })


# -----------------------------
# MODEL METRICS
# -----------------------------
@app.route("/metrics")
def metrics():
    metrics_data = get_model_metrics()
    return jsonify(metrics_data)


# -----------------------------
# FAIRNESS MONITORING
# -----------------------------
@app.route("/fairness")
def fairness():

    fairness_data = get_fairness_metrics()

    return jsonify(fairness_data)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)