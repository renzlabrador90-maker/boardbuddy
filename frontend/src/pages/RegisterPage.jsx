import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { useAuth } from "../context/useAuth";
import GoogleButton from "../components/GoogleButton";

export default function RegisterPage() {
  const { user, register, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", confirm: "", role: "tenant",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.full_name.trim()) return "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);

    setError("");
    setLoading(true);
    try {
      await register({
        full_name: form.full_name.trim(),
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(credential) {
    setError("");
    setLoading(true);
    try {
      await googleSignIn(credential, form.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-600 focus:outline-none";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-xl bg-brand-600 p-3 text-white"><Building2 size={28} /></div>
          <h1 className="mt-3 text-2xl font-bold">Create your account</h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} className={input} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={input} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">I am a</label>
            <select name="role" value={form.role} onChange={handleChange} className={input}>
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className={input} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm password</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} className={input} />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <GoogleButton onCredential={handleGoogle} />

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
