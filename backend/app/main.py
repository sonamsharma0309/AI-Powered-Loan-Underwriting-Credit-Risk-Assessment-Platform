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

app = Flask(_name_)

CORS(
    app,
    supports_credentials=True,
    origins=[
        "https://ai-powered-loan-underwriting-credit.vercel.app"
    ]
)

limiter = Limiter(get_remote_address, app=app)

model = joblib.load("models/risk_model_optimized.pkl")

# -----------------------------
# DRIFT TRACKING
# -----------------------------
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
# HEALTH
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
@app.route("/register", methods=["POST", "OPTIONS"])
@limiter.limit("10 per minute")
def register():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json

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
@app.route("/login", methods=["POST", "OPTIONS"])
@limiter.limit("10 per minute")
def login():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

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
# PREDICT
# -----------------------------
@app.route("/predict", methods=["POST", "OPTIONS"])
@limiter.limit("20 per minute", exempt_when=lambda: request.method == "OPTIONS")
def predict():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:

        data = request.get_json()

        age = float(data.get("age", 30))
        income = float(data.get("income", 50000))
        loan = float(data.get("loanAmount", 10000))
        employment = float(data.get("employmentYears", 5))
        interest = float(data.get("interestRate", 8))
        credit = float(data.get("creditHistory", 5))

        home = data.get("homeOwnership")
        intent = data.get("loanIntent")
        grade = data.get("loanGrade")
        default = data.get("previousDefault")

        loan_percent_income = loan / income
        loan_to_income = loan / income
        credit_history_ratio = credit / age
        emp_age_ratio = employment / age
        interest_loan_ratio = interest / loan

        home_rent = 1 if home == "rent" else 0
        home_own = 1 if home == "own" else 0
        home_other = 1 if home == "mortgage" else 0

        intent_edu = 1 if intent == "education" else 0
        intent_med = 1 if intent == "medical" else 0
        intent_personal = 1 if intent == "personal" else 0
        intent_business = 1 if intent == "business" else 0

        grade_B = 1 if grade == "B" else 0
        grade_C = 1 if grade == "C" else 0
        grade_D = 1 if grade == "D" else 0
        grade_E = 1 if grade == "E" else 0
        grade_F = 1 if grade == "F" else 0
        grade_G = 1 if grade == "G" else 0

        default_flag = 1 if default == "1" else 0

        row = {
            "person_age": age,
            "person_income": income,
            "person_emp_length": employment,
            "loan_amnt": loan,
            "loan_int_rate": interest,
            "loan_percent_income": loan_percent_income,
            "cb_person_cred_hist_length": credit,

            "loan_to_income": loan_to_income,
            "credit_history_ratio": credit_history_ratio,
            "emp_age_ratio": emp_age_ratio,
            "interest_loan_ratio": interest_loan_ratio,

            "person_home_ownership_OTHER": home_other,
            "person_home_ownership_OWN": home_own,
            "person_home_ownership_RENT": home_rent,

            "loan_intent_EDUCATION": intent_edu,
            "loan_intent_HOMEIMPROVEMENT": 0,
            "loan_intent_MEDICAL": intent_med,
            "loan_intent_PERSONAL": intent_personal,
            "loan_intent_VENTURE": intent_business,

            "loan_grade_B": grade_B,
            "loan_grade_C": grade_C,
            "loan_grade_D": grade_D,
            "loan_grade_E": grade_E,
            "loan_grade_F": grade_F,
            "loan_grade_G": grade_G,

            "cb_person_default_on_file_Y": default_flag
        }

        df = pd.DataFrame([row])

        # automatic feature order fix
        df = df[model.feature_names_in_]

        prob = float(model.predict_proba(df)[0][1])

        prediction = 1 if prob >= 0.4 else 0

        risk_score = round(prob * 100, 2)

        decision = "Approved" if prediction == 0 else "Rejected"

        # ADD THIS BLOCK TO SAVE DATA
       # -----------------------------
        conn = get_db()
        conn.execute("""
        INSERT INTO applications(name, age, income, loan, decision, risk)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
        data.get("name", "Unknown"),  # make sure frontend sends 'name'
        age,
        income,
        loan,
        decision,
        risk_score
))
        conn.commit()
        conn.close()
# -----------------------------

        return jsonify({
            "risk_score": risk_score,
            "decision": decision
        })

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500

#Explanability
@app.route("/explain", methods=["POST", "OPTIONS"])
@limiter.limit("10 per minute", exempt_when=lambda: request.method=="OPTIONS")
def explain():
    if request.method == "OPTIONS":
        return jsonify({"status":"ok"}), 200

    try:
        # get raw applicant data from frontend
        applicant_data = request.get_json()

        # call explain_decision directly with the raw data dict
        result = explain_decision(applicant_data)

        # send reasons to frontend
        return jsonify({
            "reasons": result.get("reasons", []),
            "feature_importance": result.get("feature_importance", {})
        })

    except Exception as e:
        print("Explain error:", e)
        return jsonify({
            "error": "Explain failed",
            "details": str(e)
        }), 500
    
# -----------------------------
# GET ALL APPLICATIONS
# -----------------------------
@app.route("/applications", methods=["GET"])
def get_applications():
    conn = get_db()
    rows = conn.execute("SELECT * FROM applications").fetchall()
    conn.close()

    apps = []
    for r in rows:
        apps.append({
            "name": r["name"],
            "age": r["age"],
            "income": r["income"],
            "loan": r["loan"],
            "decision": r["decision"],
            "risk": r["risk"]
        })
    return jsonify(apps)


# -----------------------------
# GET ANALYTICS DATA
# -----------------------------
@app.route("/analytics", methods=["GET"])
def get_analytics():
    conn = get_db()
    rows = conn.execute("SELECT * FROM applications").fetchall()
    conn.close()

    apps = []
    for r in rows:
        apps.append({
            "name": r["name"],
            "age": r["age"],
            "income": r["income"],
            "loan": r["loan"],
            "decision": r["decision"],
            "risk": r["risk"]
        })
    return jsonify(apps)


# -----------------------------
# GET AUDIT LOGS
# -----------------------------
@app.route("/audit", methods=["GET"])
def get_audit_logs():
    conn = get_db()
    rows = conn.execute("SELECT event, details, timestamp as time FROM audit_logs ORDER BY timestamp DESC").fetchall()
    conn.close()

    logs = []
    for r in rows:
        logs.append({
            "event": r["event"],
            "details": r["details"],
            "time": r["time"]
        })
    return jsonify(logs)


if _name_ == "_main_":

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)