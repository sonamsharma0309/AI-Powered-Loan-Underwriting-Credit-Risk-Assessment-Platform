
# PROJECT 91
## Intelligent Loan Underwriting & Credit Risk Assessment

---

## Date: 28-Feb-2026
Author: Shivangi Chaurasia

------------------------------------------------------------
### 1. INTRODUCTION
------------------------------------------------------------
Project 91 is an AI-powered loan underwriting platform designed to:
- Make fast, fair, and explainable credit decisions
- Reduce financial risk
- Increase financial inclusion
- Ensure regulatory compliance

Current Progress: Backend development completed, AI model integrated, API tested.

---

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

---

## 📅 Date: 02 March 2026

### ✅ Milestone Achieved: Frontend Development Completed

Today, the frontend of the Intelligent Loan Underwriting & Credit Risk Assessment Platform was successfully designed and implemented using a modern full-stack architecture.

---

## 🚀 Frontend Stack Implemented

- React (Functional Components)
- Vite 8 (Development Server & Build Tool)
- TypeScript (Type Safety & Structured Development)
- Tailwind CSS (FinTech UI Styling)
- API Integration with Backend

---

## 🧩 Features Implemented Today

### 1️⃣ Project Setup
- Initialized React + Vite + TypeScript project
- Installed and configured Tailwind CSS
- Structured professional folder architecture

### 2️⃣ UI Development
- Built Loan Application Form
- Designed Risk Score Card
- Created Dashboard Layout
- Implemented Clean FinTech Theme
- Responsive Layout Support

### 3️⃣ Backend API Integration
- Connected frontend to `/predict` endpoint
- Implemented async API call handling
- Error handling for backend connection
- Dynamic rendering of:
  - Risk Probability
  - Approval / Rejection Decision
  - Confidence Level

### 4️⃣ Architecture Alignment
Frontend aligned with backend pipeline:

Applicant Input → API → ML Model → Prediction → Dashboard Display

---

## 🏗️ Current System Status

| Component | Status |
|-----------|--------|
| Model Training | ✅ Completed |
| Model Optimization | ✅ Completed |
| Backend API | ✅ Working |
| Frontend UI | ✅ Completed |
| API Integration | ✅ Connected |
| Local Deployment | ✅ Running |

---

## 📊 Achievements Today

- Converted ML backend into full-stack AI application
- Integrated predictive analytics with interactive UI
- Built production-style FinTech dashboard
- Established scalable project structure

## 🎯 Next Steps

- Add Explainability Panel (SHAP integration)
- Implement Bias Monitoring Dashboard
- Add Authentication (JWT)
- Deploy:
  - Frontend → Vercel
  - Backend → Render / Railway
- Add Cloud Storage for logs

---

## 📈 Project Phase

Current Phase:  
**Full-Stack Integration Complete**

Next Phase:  
**Enhancement & Deployment**

---

## 🏆 Summary

The project has successfully transitioned from a standalone ML model to a full-stack AI-powered FinTech underwriting platform with live prediction capability and dashboard visualization.

This marks a major milestone toward production-grade deployment.

---

---
## Date: 4-Mar-2026

New Features added as per Project Progress report.

Added SignUP,SignIn

Added JWT Authetication System

Added Flask SQL Alchemy Database Integration.

Added Analytics Chart.

Backend API Improvements

Redeployed On Vercel.