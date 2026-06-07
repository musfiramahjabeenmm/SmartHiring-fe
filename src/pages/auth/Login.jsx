import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Mail, Lock, LogIn, Sparkles, Sun, Moon } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const userData = {
        name: res.data.name,
        role: res.data.role,
      };
      login(userData, res.data.token);
      if (res.data.role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-250">
      
      {/* Theme Toggle Button in top right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition duration-200 cursor-pointer"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Left pane: Visual teaser */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-blue-950 dark:via-slate-950 dark:to-emerald-950 flex-col justify-between p-12 border-r border-slate-200 dark:border-slate-800 transition-colors duration-250">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            SmartHiring
          </span>
        </div>

        {/* Dynamic Card Artwork */}
        <div className="my-auto relative z-10 flex flex-col gap-6">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
              Introducing SmartHiring v2.0
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Empowering the next generation of <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">hiring excellence.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">
              Streamline job applications, track candidates with advanced metrics, and select top talent seamlessly.
            </p>
          </div>

          {/* Dummy floating widget */}
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl max-w-sm shadow-2xl relative group overflow-hidden transition-all duration-250">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl opacity-10 group-hover:opacity-20 transition duration-500" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Match score</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">98% Match</span>
            </div>
            <div className="space-y-2">
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4" />
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-5/6" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">JD</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Jane Doe</span>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Shortlisted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-slate-400 dark:text-slate-500 text-xs z-10">
          © {new Date().getFullYear()} SmartHiring Inc. All rights reserved.
        </div>
      </div>

      {/* Right pane: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 xl:px-24 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md mx-auto z-10">
          {/* Logo on Mobile */}
          <div className="flex items-center gap-2 lg:hidden mb-8 justify-center">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              SmartHiring
            </span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Sign in to manage your professional journey.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-200 text-sm px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-indigo-600/30 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-550 dark:text-slate-400 mt-8">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="text-blue-600 dark:text-blue-450 font-semibold hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;