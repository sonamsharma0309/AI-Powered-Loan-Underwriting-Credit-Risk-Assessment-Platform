from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
BACKEND_DIR = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

model = joblib.load(os.path.join(MODELS_DIR, "risk_model_optimized.pkl"))
model_columns = joblib.load(os.path.join(MODELS_DIR, "model_columns.pkl"))


def get_db():
    conn = sqlite3.connect("creditai.db")
    conn.row_factory = sqlite3.Row
    return conn


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


def safe_float(v):
    try:
        return float(v)
    except Exception:
        return 0.0


init_db()


@app.route("/")
def home():
    return jsonify({"message": "Backend Running 🚀"})


@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json() or {}

        email = str(data.get("email", "")).strip()
        password = str(data.get("password", "")).strip()

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        conn = get_db()

        existing_user = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        if existing_user:
            conn.close()
            return jsonify({
                "success": False,
                "message": "User already exists"
            }), 409

        conn.execute(
            "INSERT INTO users(email, password) VALUES (?, ?)",
            (email, password)
        )
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 201

    except Exception as e:
        print("Register error:", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}

        email = str(data.get("email", "")).strip()
        password = str(data.get("password", "")).strip()

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        conn = get_db()

        user = conn.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            (email, password)
        ).fetchone()

        conn.close()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": "creditai-user"
        }), 200

    except Exception as e:
        print("Login error:", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json() or {}

        name = str(data.get("name", "")).strip()
        age = safe_float(data.get("age"))
        income = safe_float(data.get("income"))
        loan = safe_float(data.get("loanAmount"))
        emp = safe_float(data.get("employmentYears"))
        rate = safe_float(data.get("interestRate"))
        credit = safe_float(data.get("creditHistory"))

        home = str(data.get("homeOwnership", "")).strip().lower()
        intent = str(data.get("loanIntent", "")).strip().lower()
        grade = str(data.get("loanGrade", "")).strip().upper()
        default = str(data.get("previousDefault", "0")).strip()

        if not name:
            return jsonify({"error": "Name required"}), 400

        if age <= 0:
            return jsonify({"error": "Invalid age"}), 400

        if income <= 0 or loan <= 0:
            return jsonify({"error": "Invalid income/loan"}), 400

        if emp < 0 or rate < 0 or credit < 0:
            return jsonify({"error": "Employment, interest rate, and credit history cannot be negative"}), 400

        ratio = loan / income if income > 0 else 0
        interest_ratio = rate / income if income > 0 else 0
        credit_ratio = credit / age if age > 0 else 0
        emp_ratio = emp / age if age > 0 else 0

        row = {
            "person_age": age,
            "person_income": income,
            "person_emp_length": emp,
            "loan_amnt": loan,
            "loan_int_rate": rate,
            "loan_percent_income": ratio,
            "cb_person_cred_hist_length": credit,

            "loan_to_income_ratio": ratio,
            "interest_income_ratio": interest_ratio,
            "credit_history_ratio": credit_ratio,
            "emp_age_ratio": emp_ratio,

            "high_loan_ratio_flag": 1 if ratio > 0.5 else 0,
            "short_credit_history_flag": 1 if credit < 2 else 0,
            "high_interest_flag": 1 if rate > 18 else 0,
            "young_and_low_history_flag": 1 if (age < 25 and credit < 3) else 0,

            "person_home_ownership_RENT": 1 if home == "rent" else 0,
            "person_home_ownership_OWN": 1 if home == "own" else 0,
            "person_home_ownership_MORTGAGE": 1 if home == "mortgage" else 0,
            "person_home_ownership_OTHER": 1 if home == "other" else 0,

            "loan_intent_PERSONAL": 1 if intent == "personal" else 0,
            "loan_intent_EDUCATION": 1 if intent == "education" else 0,
            "loan_intent_MEDICAL": 1 if intent == "medical" else 0,
            "loan_intent_VENTURE": 1 if intent == "venture" else 0,
            "loan_intent_HOMEIMPROVEMENT": 1 if intent == "homeimprovement" else 0,
            "loan_intent_DEBTCONSOLIDATION": 1 if intent == "debtconsolidation" else 0,

            "loan_grade_A": 1 if grade == "A" else 0,
            "loan_grade_B": 1 if grade == "B" else 0,
            "loan_grade_C": 1 if grade == "C" else 0,
            "loan_grade_D": 1 if grade == "D" else 0,
            "loan_grade_E": 1 if grade == "E" else 0,
            "loan_grade_F": 1 if grade == "F" else 0,
            "loan_grade_G": 1 if grade == "G" else 0,

            "cb_person_default_on_file_N": 1 if default == "0" else 0,
            "cb_person_default_on_file_Y": 1 if default == "1" else 0,
        }

        df = pd.DataFrame([row])
        df = df.reindex(columns=model_columns, fill_value=0)

        prob = float(model.predict_proba(df)[0][1])
        risk = round(prob * 100, 2)

        THRESHOLD = 0.30

        decision = "Approved"
        reason = None

        if default == "1":
            decision = "Rejected"
            reason = "Previous default"
        elif ratio > 0.5:
            decision = "Rejected"
            reason = "High loan/income ratio"
        elif credit < 2:
            decision = "Rejected"
            reason = "Low credit history"
        elif rate > 18:
            decision = "Rejected"
            reason = "High interest rate"
        elif grade in ["E", "F", "G"]:
            decision = "Rejected"
            reason = "Risky loan grade"
        else:
            decision = "Rejected" if prob >= THRESHOLD else "Approved"

        conn = get_db()
        conn.execute(
            "INSERT INTO applications(name, age, income, loan, decision, risk) VALUES (?, ?, ?, ?, ?, ?)",
            (name, age, income, loan, decision, risk)
        )
        conn.commit()
        conn.close()

        return jsonify({
            "risk_score": risk,
            "decision": decision,
            "override_reason": reason,
            "approval_probability": round((1 - prob) * 100, 2)
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/explain", methods=["POST"])
def explain():
    try:
        data = request.get_json() or {}

        income = safe_float(data.get("income"))
        loan = safe_float(data.get("loanAmount"))
        credit = safe_float(data.get("creditHistory"))
        emp = safe_float(data.get("employmentYears"))
        rate = safe_float(data.get("interestRate"))
        default = str(data.get("previousDefault", "0")).strip()
        grade = str(data.get("loanGrade", "")).strip().upper()
        home = str(data.get("homeOwnership", "")).strip().lower()

        reasons = []

        if income > 0 and loan / income > 0.5:
            reasons.append("Loan amount is high compared to income")
        if credit < 2:
            reasons.append("Credit history is very short")
        if emp < 2:
            reasons.append("Employment history is limited")
        if rate > 18:
            reasons.append("Interest rate is very high")
        if default == "1":
            reasons.append("Previous default history increases risk")
        if grade in ["E", "F", "G"]:
            reasons.append("Loan grade indicates higher lending risk")
        if home == "rent":
            reasons.append("Rental status may indicate lower asset backing")

        if not reasons:
            reasons.append("Applicant profile looks stable and balanced")

        return jsonify({"reasons": reasons})

    except Exception as e:
        print("Explain error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/analytics")
def analytics():
    try:
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

        total_loan = conn.execute(
            "SELECT SUM(loan) as s FROM applications"
        ).fetchone()["s"]

        conn.close()

        return jsonify({
            "total": total,
            "approved": approved,
            "rejected": rejected,
            "avg_risk": avg_risk or 0,
            "total_loan": total_loan or 0
        })
    except Exception as e:
        print("Analytics error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/applications")
def get_applications():
    try:
        conn = get_db()

        rows = conn.execute("""
            SELECT * FROM applications
            ORDER BY id DESC
        """).fetchall()

        data = []
        for r in rows:
            data.append({
                "name": r["name"],
                "age": r["age"],
                "income": r["income"],
                "loan": r["loan"],
                "decision": r["decision"],
                "risk": r["risk"]
            })

        conn.close()
        return jsonify(data)

    except Exception as e:
        print("Applications error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)