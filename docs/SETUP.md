# Local Setup Guide

Follow these steps to run the **Intelligent Loan Underwriting & Credit Risk Assessment Platform** locally.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Shivangi1515/AI-Powered-Loan-Underwriting-Credit-Risk-Assessment-Platform.git

cd AI POWERED LOAN UNDERWRITING CREDIT RISK PLATFORM
```

---

## 2. Backend Setup (Flask)

```bash
cd backend

pip install -r requirements.txt

python main.py
```

Backend will run at:
http://127.0.0.1:5000

---

## 3. Frontend Setup (React + Vite)

```bash
cd ../frontend

npm install

npm run dev
```

Frontend will run at:
http://localhost:5173

---

## 4. Run the Application

* Start **backend first**
* Then start **frontend**
* Open the frontend URL in your browser

---

## Notes

* Ensure Python and Node.js are installed
* Update API base URL in frontend if needed
* Backend must be running before using frontend
