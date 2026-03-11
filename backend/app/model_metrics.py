import sqlite3

DB_PATH = "creditai.db"


# -----------------------------
# MODEL PERFORMANCE METRICS
# -----------------------------
def get_model_metrics():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM applications")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE decision='Approved'")
    approved = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE decision='Rejected'")
    rejected = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(risk) FROM applications")
    avg_risk = cursor.fetchone()[0]

    conn.close()

    if total == 0:
        approval_rate = 0
        rejection_rate = 0
    else:
        approval_rate = approved / total
        rejection_rate = rejected / total

    return {
        "total_applications": total,
        "approved": approved,
        "rejected": rejected,
        "approval_rate": approval_rate,
        "rejection_rate": rejection_rate,
        "average_risk": avg_risk
    }


# -----------------------------
# FAIRNESS / BIAS MONITORING
# -----------------------------
def get_fairness_metrics():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # low income group
    cursor.execute("""
        SELECT COUNT(*) FROM applications
        WHERE income < 50000 AND decision='Approved'
    """)
    low_income_approved = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM applications
        WHERE income < 50000
    """)
    low_income_total = cursor.fetchone()[0]

    # high income group
    cursor.execute("""
        SELECT COUNT(*) FROM applications
        WHERE income >= 50000 AND decision='Approved'
    """)
    high_income_approved = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM applications
        WHERE income >= 50000
    """)
    high_income_total = cursor.fetchone()[0]

    conn.close()

    if low_income_total == 0:
        low_income_rate = 0
    else:
        low_income_rate = low_income_approved / low_income_total

    if high_income_total == 0:
        high_income_rate = 0
    else:
        high_income_rate = high_income_approved / high_income_total

    bias_difference = abs(high_income_rate - low_income_rate)

    return {
        "low_income_approval_rate": low_income_rate,
        "high_income_approval_rate": high_income_rate,
        "bias_difference": bias_difference
    }