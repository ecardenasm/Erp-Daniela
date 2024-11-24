import axios from "axios";

export const api = axios.create({
  baseURL: "https://erp-module.onrender.com", // URL base del backend
  headers: {
    "Content-Type": "application/json",
  },
});
