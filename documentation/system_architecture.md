# 🏗️ System Architecture

## 📌 Overview

CreditAI system 3 layers me divided hai:

1. Frontend  
2. Backend  
3. Machine Learning Model  

---

## 🖥️ Frontend (React)

- User interface provide karta hai  
- Loan form input leta hai  
- Results display karta hai  
- Risk gauge show karta hai  

---

## ⚙️ Backend (FastAPI)

- API endpoints handle karta hai  
- Input data receive karta hai  
- ML model ko call karta hai  
- Response return karta hai  

---

## 🤖 ML Model

- Trained on loan dataset  
- Risk prediction karta hai  
- Output:
  - Risk score  
  - Decision  

---

## 🔄 Data Flow

1. User form fill karta hai  
2. Frontend → API call  
3. Backend → data process karta hai  
4. ML model → prediction deta hai  
5. Backend → response send karta hai  
6. Frontend → UI update  

---

## 📊 Architecture Summary

Frontend → Backend → ML Model → Response → UI  

---

## 🔐 Security

- Input validation  
- API protection (future scope)  