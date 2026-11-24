import axios from "axios";

// Set to false once the backend is built (Step 9).
export const USE_MOCK = true;

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the JWT token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ---------- TEMPORARY MOCK AUTH (removed when backend exists) ---------- */
const MOCK_USERS_KEY = "bb_mock_users";

function getMockUsers() {
  const saved = localStorage.getItem(MOCK_USERS_KEY);
  if (saved) return JSON.parse(saved);
  const seed = [
    { id: 1, full_name: "Landlord", email: "landlord@boardbuddy.com", password: "landlord123", role: "landlord" },
    { id: 2, full_name: "Tenant", email: "tenant@boardbuddy.com", password: "tenant123", role: "tenant" },
  ];
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(seed));
  return seed;
}

function publicUser({ password, ...user }) {
  return user;
}

export async function loginRequest({ email, password }) {
  if (USE_MOCK) {
    const found = getMockUsers().find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Invalid email or password");
    return { token: `mock-token-${found.id}`, user: publicUser(found) };
  }
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function registerRequest({ full_name, email, password, role }) {
  if (USE_MOCK) {
    const users = getMockUsers();
    if (users.some((u) => u.email === email.toLowerCase())) {
      throw new Error("Email is already registered");
    }
    const newUser = { id: Date.now(), full_name, email: email.toLowerCase(), password, role };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, newUser]));
    return { token: `mock-token-${newUser.id}`, user: publicUser(newUser) };
  }
  const response = await api.post("/auth/register", { full_name, email, password, role });
  return response.data;
}

export default api;