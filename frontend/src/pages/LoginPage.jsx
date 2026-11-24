import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-xl bg-brand-600 p-3 text-white"><Building2 size={28} /></div>
          <h1 className="mt-3 text-2xl font-bold">Welcome to BoardBuddy</h1>
          <p className="text-sm text-gray-500">Sign in to manage your boarding house</p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-600 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          No account yet?{" "}
          <Link to="/register" className="font-semibold text-brand-700">Register</Link>
        </p>

      </div>
    </main>
  );
}