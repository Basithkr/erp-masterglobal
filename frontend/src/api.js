import axios from "axios";

export const api = axios.create({
  baseURL: "/api",   // 👈 relative path, goes to nginx, then to backend
});

// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);