from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

model = joblib.load("../models/risk_model_optimized.pkl")


def get_db():
    conn = sqlite3.connect("creditai.db")
    conn.row_factory = sqlite3.Row
    return conn


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
    loan_to_income_ratio = loan / income
    interest_income_ratio = credit / income

    row = {
        "person_age": age,
        "person_income": income,
        "person_emp_length": 5,
        "loan_amnt": loan,
        "loan_int_rate": credit,
        "loan_percent_income": loan_percent_income,
        "cb_person_cred_hist_length": 5,
        "loan_to_income_ratio": loan_to_income_ratio,
        "interest_income_ratio": interest_income_ratio,

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

    prediction = int(model.predict(df)[0])
    prob = float(model.predict_proba(df)[0][1])

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

    total = conn.execute(
        "SELECT COUNT(*) as c FROM applications"
    ).fetchone()["c"]

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
# AI EXPLANATION
# -----------------------------

@app.route("/explain", methods=["POST"])
def explain():

    data = request.json

    income = float(data["income"])
    loan = float(data["loanAmount"])
    credit = float(data["creditHistory"])

    employment = float(data.get("employmentYears",0))
    interest = float(data.get("interestRate",0))

    home = data.get("homeOwnership","")
    intent = data.get("loanIntent","")
    grade = data.get("loanGrade","")
    default = data.get("previousDefault","0")

    reasons = []

    loan_ratio = loan / income

    if credit < 5:
        reasons.append("Very short credit history increases default risk")
    elif credit >= 10:
        reasons.append("Strong credit history improves loan eligibility")

    if employment < 2:
        reasons.append("Short employment history indicates unstable income")
    elif employment >= 5:
        reasons.append("Stable employment history supports repayment ability")

    if interest > 15:
        reasons.append("High interest rate indicates higher financial risk")
    elif interest < 8:
        reasons.append("Low interest rate indicates safer credit profile")

    if home == "rent":
        reasons.append("Renting home increases financial risk")
    elif home == "own":
        reasons.append("Home ownership improves financial stability")

    if intent == "education":
        reasons.append("Education loans are evaluated more flexibly")
    elif intent == "business":
        reasons.append("Business loans involve moderate financial uncertainty")
    elif intent == "personal":
        reasons.append("Personal loans require stronger repayment ability")

    if grade in ["A","B"]:
        reasons.append("High loan grade indicates strong credit quality")
    elif grade in ["E","F","G"]:
        reasons.append("Low loan grade increases default probability")

    if default == "1":
        reasons.append("Previous loan default negatively affects approval chances")

    if loan_ratio > 0.8 and intent != "education":
        reasons.append("Loan size is very high relative to income")
    elif loan_ratio < 0.4:
        reasons.append("Loan amount appears manageable relative to income")

    if len(reasons) == 0:
        reasons.append("Applicant financial profile appears balanced")

    return jsonify({"reasons": reasons})


# -----------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)