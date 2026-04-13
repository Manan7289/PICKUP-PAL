import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Utensils, Eye, EyeOff, ArrowRight } from "lucide-react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate(); // ✅ FIXED: moved inside component
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/restaurants"); // ✅ Redirect after login
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-slate-100 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 mb-4">
              <Utensils className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your PickupPal account</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-5"
            >
              {error}
            </motion.div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Divider */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center text-slate-400 text-sm mt-6">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
