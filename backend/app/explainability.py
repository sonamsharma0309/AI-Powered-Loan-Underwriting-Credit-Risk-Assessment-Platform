from app.model_loader import load_model
import shap
import pandas as pd

model = load_model()

def explain_decision(applicant_data: dict):
    df = pd.DataFrame([applicant_data])

    # Feature Engineering
    df["loan_to_income_ratio"] = df["loan_amnt"] / df["person_income"]
    df["interest_income_ratio"] = df["loan_int_rate"] / df["person_income"]

    # One-hot encode categorical feature (match model)
    categorical_cols = df.select_dtypes(include=["object", "string"]).columns
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # Align columns with model training
    model_features = model.get_booster().feature_names
    for col in model_features:
        if col not in df.columns:
            df[col] = 0
    df = df[model_features]

    # SHAP
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df)
    explanation = dict(zip(df.columns, shap_values[0].tolist()))
    return explanation