import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest } from "../services/api";

const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("bb_user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  function saveSession({ token, user }) {
    localStorage.setItem("bb_token", token);
    localStorage.setItem("bb_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(credentials) {
    saveSession(await loginRequest(credentials));
  }

  async function register(details) {
    saveSession(await registerRequest(details));
  }

  function logout() {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}