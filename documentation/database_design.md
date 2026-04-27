# 🗄️ Database Design

## 📌 Overview

Currently system stateless hai (no DB), lekin future me database use kiya ja sakta hai.

---

## 📊 Applicant Table

| Field | Type | Description |
|------|------|-----------|
| name | string | Applicant name |
| age | int | Age |
| income | float | Income |
| loan_amount | float | Loan amount |
| credit_history | int | Credit score |

---

## 📊 Logs Table

| Field | Type | Description |
|------|------|-----------|
| id | int | Unique ID |
| decision | string | Approved/Rejected |
| risk_score | float | Risk % |
| timestamp | datetime | Time |

---

## 🔮 Future DB Options

- MongoDB  
- PostgreSQL  