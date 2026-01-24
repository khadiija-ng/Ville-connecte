import axios from "axios";
import { API_BASE_URL } from "./config";
import { getToken, logout } from "../auth/storage";

export const http = axios.create({
  baseURL: API_BASE_URL,
});

export const httpAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    // If token invalid/expired
    if (status === 401) {
      logout();
      // Avoid infinite loops; simply force refresh to login.
      if (location.pathname !== "/login") location.href = "/login";
    }
    return Promise.reject(err);
  }
);
