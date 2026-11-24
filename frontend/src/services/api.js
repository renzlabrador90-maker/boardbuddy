import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function loginRequest(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function registerRequest(details) {
  const response = await api.post("/auth/register", details);
  return response.data;
}

export async function currentUserRequest() {
  const response = await api.get("/auth/me");
  return response.data.user;
}

export async function googleClientIdRequest() {
  const response = await api.get("/auth/google-config");
  return response.data.clientId;
}

export async function googleSignInRequest(credential, role) {
  const response = await api.post("/auth/google", { credential, role });
  return response.data;
}

export default api;
