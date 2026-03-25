from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3
import os

app = Flask(__name__)
CORS(app)


model = joblib.load("../models/risk_model_optimized.pkl")


def get_db():
    conn = sqlite3.connect("creditai.db")
    conn.row_factory = sqlite3.Row
    return conn


# -----------------------------
# DATABASE INIT
# -----------------------------

def init_db():

    conn = get_db()

    # APPLICATION TABLE
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

    # USERS TABLE
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

    email = data["email"]
    password = data["password"]

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    if user:
        conn.close()
        return jsonify({"success":False,"message":"User already exists"})

    conn.execute(
        "INSERT INTO users(email,password) VALUES (?,?)",
        (email,password)
    )

    conn.commit()
    conn.close()

    return jsonify({"success":True})


# -----------------------------
# LOGIN
# -----------------------------

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email,password)
    ).fetchone()

    conn.close()

    if user:
        return jsonify({
            "success":True,
            "token":"creditai-user"
        })

    return jsonify({
        "success":False,
        "message":"Invalid credentials"
    })


# -----------------------------
# LOAN PREDICTION
# -----------------------------

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    name = data["name"]
    age = float(data["age"])
    income = float(data["income"])
    loan = float(data["loanAmount"])
    credit = float(data["creditHistory"])

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

        "person_home_ownership_OTHER":0,
        "person_home_ownership_OWN":0,
        "person_home_ownership_RENT":1,

        "loan_intent_EDUCATION":0,
        "loan_intent_HOMEIMPROVEMENT":0,
        "loan_intent_MEDICAL":0,
        "loan_intent_PERSONAL":1,
        "loan_intent_VENTURE":0,

        "loan_grade_B":0,
        "loan_grade_C":0,
        "loan_grade_D":0,
        "loan_grade_E":0,
        "loan_grade_F":0,
        "loan_grade_G":0,

        "cb_person_default_on_file_Y":0
    }

    df = pd.DataFrame([row])

    prediction = int(model.predict(df)[0])
    prob = float(model.predict_proba(df)[0][1])

    risk_score = round(prob * 100,2)
    approval_probability = round((1-prob)*100,2)

    decision = "Approved" if prediction == 0 else "Rejected"

    conn = get_db()

    conn.execute(
        "INSERT INTO applications(name,age,income,loan,decision,risk) VALUES (?,?,?,?,?,?)",
        (name,age,income,loan,decision,risk_score)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "risk_score":risk_score,
        "approval_probability":approval_probability,
        "decision":decision
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
        "total":total,
        "approved":approved,
        "rejected":rejected,
        "avg_risk":avg_risk or 0
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

    reasons = []

    if loan/income > 0.5:
        reasons.append("Loan amount too high compared to income")

    if credit < 10:
        reasons.append("Short credit history")

    if loan > income*0.4:
        reasons.append("High loan to income ratio")

    if len(reasons)==0:
        reasons.append("Applicant profile looks safe")

    return jsonify({"reasons":reasons})


# -----------------------------

if __name__ == "__main__":
    app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)