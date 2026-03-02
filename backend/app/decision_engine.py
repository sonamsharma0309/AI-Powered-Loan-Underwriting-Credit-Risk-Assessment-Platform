from app.model_loader import load_model
import numpy as np
import pandas as pd

# Load model once
model = load_model()

def make_decision(applicant_data: dict):
    """
    applicant_data: dictionary of input features
    Returns: dict with probability and decision
    """
    df = pd.DataFrame([applicant_data])

    # Feature Engineering
    df["loan_to_income_ratio"] = df["loan_amnt"] / df["person_income"]
    df["interest_income_ratio"] = df["loan_int_rate"] / df["person_income"]

    # One-hot encode categorical features (must match training)...
    categorical_cols = df.select_dtypes(include=["object", "string"]).columns
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # Align columns with model training
    model_features = model.get_booster().feature_names
    for col in model_features:
        if col not in df.columns:
            df[col] = 0
    df = df[model_features]

    # Predict
    prob = model.predict_proba(df)[:, 1][0]
    threshold = 0.40
    decision = "Approved" if prob < threshold else "Rejected"

    return {"probability_of_default": float(prob), "decision": decision}