def explain_decision(applicant_data):

    try:

        # -------------------------
        # Safe input extraction
        # -------------------------

        income = float(applicant_data.get("income", 0) or 0)
        loan = float(applicant_data.get("loanAmount", 0) or 0)
        credit = float(applicant_data.get("creditHistory", 0) or 0)
        age = float(applicant_data.get("age", 0) or 0)

        if income < 0 or loan < 0:
            raise ValueError("Negative values not allowed")

    except Exception:

        return {
            "reasons": ["Invalid input data"],
            "feature_importance": {}
        }

    reasons = []

    # -------------------------
    # Reason generation
    # -------------------------

    if credit < 5:
        reasons.append("Short credit history increases loan risk")

    elif credit >= 10:
        reasons.append("Strong credit history improves loan eligibility")

    if income > 50000:
        reasons.append("Higher income improves repayment ability")

    if income > 0 and loan > income:
        reasons.append("Loan amount exceeds income which increases risk")

    if not reasons:
        reasons.append("Applicant financial profile appears balanced")

    # -------------------------
    # Safe denominator
    # -------------------------

    denominator = income + loan + 1

    # -------------------------
    # Feature importance
    # -------------------------

    feature_importance = {
        "income_impact": round(income / denominator, 2),
        "loan_amount_impact": round(loan / denominator, 2),
        "credit_history_impact": round(min(credit / 20, 1), 2),
        "age_impact": round(min(age / 100, 1), 2)
    }

    return {
        "reasons": reasons,
        "feature_importance": feature_importance
    }