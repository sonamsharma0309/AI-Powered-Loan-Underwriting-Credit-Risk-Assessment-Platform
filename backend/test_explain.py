import requests

url = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com/explain"

data = {
    "income":60000,
    "loanAmount":15000,
    "creditHistory":10
}

res = requests.post(url,json=data)

print(res.json())