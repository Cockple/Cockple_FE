import axios from "axios";

const api = axios.create({
  baseURL: "https://cockple.store",
});

const TEMP_TOKEN = import.meta.env.VITE_APP_DEV_TOKEN;

api.interceptors.request.use(
  config => {
    if (TEMP_TOKEN) {
      config.headers.Authorization = `Bearer ${TEMP_TOKEN}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
const token = import.meta.env.VITE_APP_ACCESS_TOKEN;
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});