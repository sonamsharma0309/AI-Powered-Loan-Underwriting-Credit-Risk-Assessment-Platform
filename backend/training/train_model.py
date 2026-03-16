import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import joblib
import os

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


# ------------------------
# FEATURE ENGINEERING
# ------------------------

df["loan_to_income"] = df["loan_amnt"] / (df["person_income"] + 1)

df["credit_history_ratio"] = df["cb_person_cred_hist_length"] / (df["person_age"] + 1)

df["emp_age_ratio"] = df["person_emp_length"] / (df["person_age"] + 1)

df["interest_loan_ratio"] = df["loan_int_rate"] / (df["loan_amnt"] + 1)


# ------------------------
# ENCODE CATEGORICAL
# ------------------------

categorical_cols = df.select_dtypes(include=["object"]).columns

df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)


# ------------------------
# SPLIT
# ------------------------

X = df.drop("loan_status", axis=1)
y = df["loan_status"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)


# ------------------------
# HANDLE CLASS IMBALANCE
# ------------------------

class_counts = y_train.value_counts()

if len(class_counts) < 2:
    scale_pos_weight = 1
else:
    scale_pos_weight = class_counts[0] / class_counts[1]


# ------------------------
# MODEL
# ------------------------

model = XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.03,
    subsample=0.9,
    colsample_bytree=0.8,
    gamma=0.1,
    min_child_weight=3,
    reg_alpha=0.5,
    reg_lambda=1,
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    eval_metric="logloss"
)

model.fit(X_train, y_train)


# ------------------------
# EVALUATION
# ------------------------

y_prob = model.predict_proba(X_test)[:, 1]

y_pred = (y_prob > 0.4).astype(int)

print("Accuracy:", accuracy_score(y_test, y_pred))

print("ROC AUC:", roc_auc_score(y_test, y_prob))

print(classification_report(y_test, y_pred))


# ------------------------
# SAVE MODEL
# ------------------------

models_dir = os.path.join(os.path.dirname(current_dir), "models")

os.makedirs(models_dir, exist_ok=True)

model_path = os.path.join(models_dir, "risk_model_optimized.pkl")

joblib.dump(model, model_path)

print("Model saved:", model_path)