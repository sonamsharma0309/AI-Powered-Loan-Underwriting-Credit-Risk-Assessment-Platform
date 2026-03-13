from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import joblib
import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

from app.model_metrics import get_model_metrics, get_fairness_metrics
from app.explainability import explain_decision

app = Flask(__name__)

# -----------------------------
# CORS CONFIG
# -----------------------------
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

limiter = Limiter(get_remote_address, app=app)

model = joblib.load("models/risk_model_optimized.pkl")

training_income_avg = 50000
live_income_values = []

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
# AUDIT LOG
# -----------------------------
def log_event(event, details):

    conn = get_db()

    conn.execute(
        "INSERT INTO audit_logs(event,details) VALUES (?,?)",
        (event, details)
    )

    conn.commit()
    conn.close()


# -----------------------------
# ADMIN CHECK
# -----------------------------
def is_admin(email):

    conn = get_db()

    user = conn.execute(
        "SELECT role FROM users WHERE email=?",
        (email,)
    ).fetchone()

    conn.close()

    if user and user["role"] == "admin":
        return True

    return False


# -----------------------------
# INIT DATABASE
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
        password TEXT,
        role TEXT DEFAULT 'user'
    )
    """)

    conn.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event TEXT,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


init_db()


@app.route("/")
def home():
    return jsonify({"message": "CreditAI Backend Running"})


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.route("/health")
def health():
    return jsonify({
        "status": "running",
        "model_loaded": True
    })


# -----------------------------
# REGISTER
# -----------------------------
@app.route("/register", methods=["POST"])
@limiter.limit("10 per minute")
def register():

    data = request.json or {}

    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

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
        "INSERT INTO users(email,password,role) VALUES (?,?,?)",
        (email, hashed_password, role)
    )

    conn.commit()
    conn.close()

    log_event("USER_REGISTER", email)

    return jsonify({"success": True})


# -----------------------------
# LOGIN
# -----------------------------
@app.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():

    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    conn.close()

    if user and check_password_hash(user["password"], password):

        log_event("USER_LOGIN", email)

        return jsonify({
            "success": True,
            "token": "creditai-user",
            "role": user["role"]
        })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })


# -----------------------------
# LOAN PREDICTION (UPDATED)
# -----------------------------
@app.route("/predict", methods=["POST"])
@limiter.limit("20 per minute")
def predict():

    try:

        data = request.json or {}

        name = data.get("name") or "Applicant"

        age = float(data.get("age") or 30)
        income = float(data.get("income") or 50000)
        loan = float(data.get("loanAmount") or 10000)

        credit = float(data.get("creditHistory") or 5)
        employment = float(data.get("employmentYears") or 5)
        interest = float(data.get("interestRate") or 8)

        home = (data.get("homeOwnership") or "rent").lower()
        intent = (data.get("loanIntent") or "personal").lower()
        grade = (data.get("loanGrade") or "B").upper()
        default = int(data.get("previousDefault") or 0)

        loan_percent_income = loan / income
        loan_to_income_ratio = loan / income
        interest_income_ratio = interest / income

        row = {
            "person_age": age,
            "person_income": income,
            "person_emp_length": employment,
            "loan_amnt": loan,
            "loan_int_rate": interest,
            "loan_percent_income": loan_percent_income,
            "cb_person_cred_hist_length": credit,
            "loan_to_income_ratio": loan_to_income_ratio,
            "interest_income_ratio": interest_income_ratio,

            "person_home_ownership_OTHER": 1 if home == "other" else 0,
            "person_home_ownership_OWN": 1 if home == "own" else 0,
            "person_home_ownership_RENT": 1 if home == "rent" else 0,

            "loan_intent_EDUCATION": 1 if intent == "education" else 0,
            "loan_intent_HOMEIMPROVEMENT": 1 if intent == "homeimprovement" else 0,
            "loan_intent_MEDICAL": 1 if intent == "medical" else 0,
            "loan_intent_PERSONAL": 1 if intent == "personal" else 0,
            "loan_intent_VENTURE": 1 if intent == "venture" else 0,

            "loan_grade_B": 1 if grade == "B" else 0,
            "loan_grade_C": 1 if grade == "C" else 0,
            "loan_grade_D": 1 if grade == "D" else 0,
            "loan_grade_E": 1 if grade == "E" else 0,
            "loan_grade_F": 1 if grade == "F" else 0,
            "loan_grade_G": 1 if grade == "G" else 0,

            "cb_person_default_on_file_Y": 1 if default == 1 else 0
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

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)