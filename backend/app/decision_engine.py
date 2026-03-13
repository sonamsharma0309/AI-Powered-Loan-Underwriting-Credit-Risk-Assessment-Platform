import joblib
import os
import numpy as np
import shap

# -----------------------------
# PATH CONFIGURATION
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "risk_model_optimized.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "models", "preprocessor.pkl")


# -----------------------------
# SAFE MODEL LOADING
# -----------------------------

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

if not os.path.exists(PREPROCESSOR_PATH):
    raise FileNotFoundError(f"Preprocessor not found: {PREPROCESSOR_PATH}")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


# -----------------------------
# SHAP EXPLAINER
# -----------------------------

try:
    explainer = shap.TreeExplainer(model)
except Exception:
    explainer = None


# -----------------------------
# MAIN DECISION FUNCTION
# -----------------------------

def make_decision(applicant_data):

    try:

        if not isinstance(applicant_data, dict):
            raise ValueError("Applicant data must be a dictionary")

        feature_names = list(applicant_data.keys())

        input_values = list(applicant_data.values())

        input_array = np.array([input_values])

        processed = preprocessor.transform(input_array)

        prediction = model.predict(processed)[0]

        probability = float(model.predict_proba(processed)[0][1])

        decision = "Approved" if prediction == 1 else "Rejected"

        feature_importance = {}

        # -----------------------------
        # SHAP EXPLANATION
        # -----------------------------

        if explainer:

            shap_values = explainer.shap_values(processed)

            if isinstance(shap_values, list):
                shap_values = shap_values[1]

            for i, feature in enumerate(feature_names):

                try:
                    feature_importance[feature] = float(shap_values[0][i])
                except:
                    feature_importance[feature] = 0.0

        return {
            "decision": decision,
            "risk_score": probability,
            "feature_importance": feature_importance
        }

    except Exception as e:

        return {
            "decision": "Error",
            "risk_score": 0,
            "feature_importance": {},
            "error": str(e)
        }