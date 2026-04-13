import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Lock, Phone, MapPin, Calendar,
  Utensils, Eye, EyeOff, ArrowRight, CheckCircle2
} from "lucide-react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Field = ({ icon: Icon, type = "text", placeholder, value, onChange, rightElement }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
    />
    {rightElement && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
    )}
  </div>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", age: "", email: "", phone: "", address: "", password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleRegister = async () => {
    setError("");
    const { name, email, password } = form;
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-slate-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl shadow-slate-200/60"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-500 w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Account created!</h2>
          <p className="text-slate-500 mt-2">Redirecting you to login…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="fixed top-0 left-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 mb-4">
              <Utensils className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create account</h1>
            <p className="text-slate-500 text-sm mt-1">Join PickupPal and skip the queue</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-5"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <Field icon={User} placeholder="Full name" value={form.name} onChange={update("name")} />
            <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={update("email")} />
            <Field
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={update("password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <Field icon={Phone} type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={update("phone")} />
            <Field icon={Calendar} type="number" placeholder="Age (optional)" value={form.age} onChange={update("age")} />
            <Field icon={MapPin} placeholder="Address (optional)" value={form.address} onChange={update("address")} />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
