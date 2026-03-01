
PROJECT 91
Intelligent Loan Underwriting & Credit Risk Assessment


Date: 28-Feb-2026
Author: Shivangi Chaurasia

------------------------------------------------------------
1. INTRODUCTION
------------------------------------------------------------
Project 91 is an AI-powered loan underwriting platform designed to:
- Make fast, fair, and explainable credit decisions
- Reduce financial risk
- Increase financial inclusion
- Ensure regulatory compliance

Current Progress: Backend development completed, AI model integrated, API tested.

------------------------------------------------------------
2. BACKEND DEVELOPMENT
------------------------------------------------------------

2.1 Model Development
- Model: XGBoost classifier
- Hyperparameters optimized
- Accuracy: 86.56%
- ROC-AUC: 0.9424
- Classification report shows balanced precision/recall
- Model saved as: models/risk_model_optimized.pkl

2.2 Explainability
- SHAP integrated for feature contribution explanations
- Generates plain English AI summaries
- Example summary:
  "Loan approved because applicant’s low loan-to-income ratio
   and long employment history reduce default risk."

2.3 API Development
- Endpoint: POST /predict
- Input: JSON applicant data
- Output: JSON response with:
  {
    "decision": "Approved",
    "probability_of_default": 0.18,
    "summary": "Loan approved because applicant's low loan-to-income ratio ..."
  }
- API tested with Postman & terminal

2.4 Project Structure
backend/
├── app/
│   ├── main.py
│   ├── decision_engine.py
│   ├── explainability.py
│   └── model_loader.py
├── models/
│   └── risk_model_optimized.pkl
└── training/
    └── train_model.py

------------------------------------------------------------
3. BACKEND TESTING
------------------------------------------------------------
- Postman: Verified API responses & explainability
- Terminal: Flask server runs without errors
- SHAP explanations returned correctly

Sample Output:
{
  "decision": "Approved",
  "probability_of_default": 0.18,
  "summary": "Loan approved because applicant's low loan-to-income ratio ..."
}

------------------------------------------------------------
4. NEXT STEPS
------------------------------------------------------------
1. Frontend Development
   - Single-page dark-themed dashboard
   - Loan form + AI Decision + Explainability summary
2. Docker Integration
   - Containerize backend (later frontend)
   - Enable cloud deployment
3. End-to-End Testing
   - Form submission → API → AI decision + explainability display

------------------------------------------------------------
5. NOTES / OBSERVATIONS
------------------------------------------------------------
- Backend & model are production-ready
- Explainability fully functional via SHAP
- Dataset and .pkl files local; can be added to deployment image