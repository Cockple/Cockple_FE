import axios from "axios";

const api = axios.create({
  baseURL: "https://cockple.store",
});

export default api;

const token = import.meta.env.VITE_APP_ACCESS_TOKEN;

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});