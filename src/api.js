import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://woo-backend.onrender.com",
  timeout: 10000,
});

export default api;
