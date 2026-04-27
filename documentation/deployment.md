
---

# 📁 08_deployment.md

```md
# 🚀 Deployment Guide

## 🌐 Frontend (Vercel)

1. GitHub repo connect karo  
2. Vercel me import karo  
3. Auto deploy ho jayega  

---

## ⚙️ Backend (Render)

### Build Command
pip install -r requirements.txt

### Start Command
gunicorn app.main:app

---

## ⚠️ Common Issues

- ModuleNotFoundError → import path check karo  
- Port issue → use $PORT  
- Build fail → dependencies check karo  