# API Reference

## Authentication

* `POST /register` — Register a new user
* `POST /login` — Login and receive authentication token

## Dashboard

* `GET /dashboard` — Get dashboard data (summary, recent predictions)

## Loan Prediction

* `POST /predict` — Predict loan approval and risk score
* `POST /explain` — Get explanation for prediction

## Analytics

* `GET /analytics` — Get system statistics (total applications, approvals, rejections, avg risk)

## Audit Logs

* `GET /audit` — Fetch decision logs and history

---

## Notes

* All endpoints accept and return **JSON**
* Authentication required for protected routes (dashboard, analytics, audit)
* Input must match model features (income, loan amount, credit history, etc.)
* Decision is based on model risk score threshold
* API is rate-limited for security
