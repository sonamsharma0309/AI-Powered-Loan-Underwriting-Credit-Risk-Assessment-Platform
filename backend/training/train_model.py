import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    roc_auc_score,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
)

# ------------------------
# LOAD DATASET
# ------------------------

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "credit_risk_dataset.csv")

if not os.path.exists(file_path):
    raise FileNotFoundError(f"Dataset not found: {file_path}")

df = pd.read_csv(file_path)
print("Dataset Loaded:", df.shape)

# ------------------------
# DATA CLEANING
# ------------------------

df = df[(df["person_age"] > 18) & (df["person_age"] < 70)]
df = df[df["person_emp_length"] < 50]

df.fillna(df.median(numeric_only=True), inplace=True)

print("After cleaning:", df.shape)

# ------------------------
# FEATURE ENGINEERING
# ------------------------

df["loan_to_income_ratio"] = df["loan_amnt"] / (df["person_income"] + 1)
df["interest_income_ratio"] = df["loan_int_rate"] / (df["person_income"] + 1)
df["credit_history_ratio"] = df["cb_person_cred_hist_length"] / (df["person_age"] + 1)
df["emp_age_ratio"] = df["person_emp_length"] / (df["person_age"] + 1)

# business-driven extra features
df["high_loan_ratio_flag"] = (df["loan_amnt"] / (df["person_income"] + 1) > 0.5).astype(int)
df["short_credit_history_flag"] = (df["cb_person_cred_hist_length"] < 2).astype(int)
df["high_interest_flag"] = (df["loan_int_rate"] > 18).astype(int)
df["young_and_low_history_flag"] = (
    (df["person_age"] < 25) & (df["cb_person_cred_hist_length"] < 3)
).astype(int)

# ------------------------
# ENCODE CATEGORICAL
# ------------------------

categorical_cols = [
    "person_home_ownership",
    "loan_intent",
    "loan_grade",
    "cb_person_default_on_file",
]

df = pd.get_dummies(df, columns=categorical_cols, drop_first=False)

# ------------------------
# SPLIT
# ------------------------

X = df.drop("loan_status", axis=1)
y = df["loan_status"]

# first split train vs temp
X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    stratify=y,
    random_state=42
)

# then temp -> validation + test
X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    stratify=y_temp,
    random_state=42
)

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Test shape:", X_test.shape)

# ------------------------
# HANDLE CLASS IMBALANCE
# ------------------------

class_counts = y_train.value_counts()

if len(class_counts) < 2:
    scale_pos_weight = 1
else:
    scale_pos_weight = class_counts[0] / class_counts[1]

print("scale_pos_weight:", scale_pos_weight)

# ------------------------
# MODEL
# ------------------------

model = XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.03,
    subsample=0.9,
    colsample_bytree=0.8,
    gamma=0.2,
    min_child_weight=5,
    reg_alpha=0.7,
    reg_lambda=1.5,
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    eval_metric="logloss",
)

model.fit(
    X_train,
    y_train,
    eval_set=[(X_val, y_val)],
    verbose=False,
)

# ------------------------
# EVALUATION
# ------------------------

y_prob = model.predict_proba(X_test)[:, 1]

# risky customers approve nahi hone chahiye
# lower threshold = stricter rejection
THRESHOLD = 0.30
y_pred = (y_prob >= THRESHOLD).astype(int)

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print("\n========== MODEL PERFORMANCE ==========")
print("Accuracy:", accuracy)
print("ROC AUC:", roc_auc)
print("Precision (Risky class):", precision)
print("Recall (Risky class):", recall)
print("F1 Score (Risky class):", f1)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

cm = confusion_matrix(y_test, y_pred)
tn, fp, fn, tp = cm.ravel()

print("\nConfusion Matrix:")
print(cm)

print(f"\nTN (Safe correctly not flagged risky): {tn}")
print(f"FP (Safe but predicted risky)        : {fp}")
print(f"FN (Risky but predicted safe)        : {fn}")
print(f"TP (Risky correctly caught)          : {tp}")

if (fn + tp) > 0:
    risky_missed_rate = fn / (fn + tp)
    print(f"\nRisky customers missed rate: {risky_missed_rate:.4f}")

# ------------------------
# FEATURE IMPORTANCE
# ------------------------

feature_importance = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
}).sort_values(by="importance", ascending=False)

print("\nTop 15 Important Features:")
print(feature_importance.head(15))

# save feature importance chart
models_dir = os.path.join(os.path.dirname(current_dir), "models")
os.makedirs(models_dir, exist_ok=True)

plt.figure(figsize=(10, 8))
top_features = feature_importance.head(15).sort_values(by="importance")
plt.barh(top_features["feature"], top_features["importance"])
plt.title("Top 15 Feature Importances")
plt.xlabel("Importance")
plt.tight_layout()

importance_plot_path = os.path.join(models_dir, "feature_importance.png")
plt.savefig(importance_plot_path, dpi=200, bbox_inches="tight")
plt.close()

# ------------------------
# SAVE MODEL
# ------------------------

model_path = os.path.join(models_dir, "risk_model_optimized.pkl")
columns_path = os.path.join(models_dir, "model_columns.pkl")
metrics_path = os.path.join(models_dir, "model_metrics.txt")

joblib.dump(model, model_path)
joblib.dump(list(X.columns), columns_path)

with open(metrics_path, "w", encoding="utf-8") as f:
    f.write("MODEL PERFORMANCE\n")
    f.write(f"Accuracy: {accuracy}\n")
    f.write(f"ROC AUC: {roc_auc}\n")
    f.write(f"Precision (Risky class): {precision}\n")
    f.write(f"Recall (Risky class): {recall}\n")
    f.write(f"F1 Score (Risky class): {f1}\n")
    f.write(f"Threshold used: {THRESHOLD}\n")
    f.write("\nConfusion Matrix:\n")
    f.write(str(cm))
    f.write("\n\n")
    f.write(f"TN: {tn}\n")
    f.write(f"FP: {fp}\n")
    f.write(f"FN: {fn}\n")
    f.write(f"TP: {tp}\n")

print("\n========== SAVED FILES ==========")
print("Model saved:", model_path)
print("Model columns saved:", columns_path)
print("Metrics saved:", metrics_path)
print("Feature importance plot saved:", importance_plot_path)
print("Threshold used:", THRESHOLD)