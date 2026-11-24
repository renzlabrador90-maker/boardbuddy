import { useEffect, useState } from "react";
import { currentUserRequest, googleSignInRequest, loginRequest, registerRequest } from "../services/api";
import { AuthContext } from "./AuthContextStore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(
    () => Boolean(localStorage.getItem("bb_token"))
  );

  useEffect(() => {
    localStorage.removeItem("bb_mock_users");
    localStorage.removeItem("bb_user");
    if (!localStorage.getItem("bb_token")) return;

    let active = true;
    currentUserRequest()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem("bb_token");
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function saveSession({ token, user }) {
    localStorage.setItem("bb_token", token);
    setUser(user);
    setCheckingSession(false);
  }

  async function login(credentials) {
    saveSession(await loginRequest(credentials));
  }

  async function register(details) {
    saveSession(await registerRequest(details));
  }

  async function googleSignIn(credential, role) {
    saveSession(await googleSignInRequest(credential, role));
  }

  function logout() {
    localStorage.removeItem("bb_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checkingSession, login, register, googleSignIn, logout }}>
      {checkingSession ? (
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Checking session...
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
