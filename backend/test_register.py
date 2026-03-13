import requests

url = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com//register"

data = {
    "email": "admin@gmail.com",
    "password": "123",
    "role": "admin"
}

response = requests.post(url, json=data)

print(response.json())
