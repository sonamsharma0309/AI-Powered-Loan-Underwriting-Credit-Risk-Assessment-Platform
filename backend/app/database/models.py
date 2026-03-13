from datetime import datetime
from app.database import db


# -------------------------
# 👤 USER MODEL
# -------------------------

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False,
        index=True
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(50),
        default="loan_officer"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


# -------------------------
# 📊 PREDICTION MODEL
# -------------------------

class Prediction(db.Model):

    __tablename__ = "predictions"

    id = db.Column(db.Integer, primary_key=True)

    applicant_name = db.Column(
        db.String(100),
        nullable=False
    )

    risk_score = db.Column(
        db.Float,
        nullable=False
    )

    decision = db.Column(
        db.String(50),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


# -------------------------
# 🧾 AUDIT LOG MODEL
# -------------------------

class AuditLog(db.Model):

    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)

    user_email = db.Column(
        db.String(120),
        index=True
    )

    action = db.Column(
        db.String(200),
        nullable=False
    )

    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )