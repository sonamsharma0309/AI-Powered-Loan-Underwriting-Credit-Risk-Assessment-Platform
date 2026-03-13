import axios from "axios";

const API = import.meta.env.VITE_API_URL || "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com/";

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;