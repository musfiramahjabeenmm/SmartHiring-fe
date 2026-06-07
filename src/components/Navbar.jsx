import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sparkles, LogOut, Briefcase, FileText, LayoutDashboard, PlusCircle, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isRecruiter = user?.role === "RECRUITER";
  
  const navItems = isRecruiter
    ? [
        { label: "Dashboard", path: "/recruiter/dashboard", icon: LayoutDashboard },
        { label: "My Jobs", path: "/recruiter/jobs", icon: Briefcase },
        { label: "Post Job", path: "/recruiter/post-job", icon: PlusCircle },
      ]
    : [
        { label: "Dashboard", path: "/candidate/dashboard", icon: LayoutDashboard },
        { label: "Browse Jobs", path: "/candidate/jobs", icon: Briefcase },
        { label: "My Applications", path: "/candidate/applications", icon: FileText },
      ];

  // Colors based on recruiter (blue/indigo) or candidate (emerald/teal)
  const activeBg = isRecruiter
    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";

  const glowTheme = isRecruiter
    ? "from-blue-500 to-indigo-600 shadow-blue-500/20"
    : "from-emerald-500 to-teal-600 shadow-emerald-500/20";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 px-6 py-4 flex justify-between items-center font-sans transition-colors duration-250">
      <div className="flex items-center gap-3">
        <Link to={isRecruiter ? "/recruiter/dashboard" : "/candidate/dashboard"} className="flex items-center gap-2 group">
          <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${glowTheme} text-white shadow-lg transition duration-300 group-hover:scale-105`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
            SmartHiring
          </span>
        </Link>
        
        {/* Role Pill */}
        <span className={`hidden md:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          isRecruiter 
            ? "bg-blue-500/5 text-blue-600 dark:text-blue-400/90 border-blue-550/15" 
            : "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400/90 border-emerald-550/15"
        }`}>
          {isRecruiter ? "Recruiter Workspace" : "Candidate Portal"}
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border border-transparent transition duration-200 cursor-pointer ${
                  isActive
                    ? activeBg
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-900 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Logged in as</span>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{user?.name}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-red-500/10 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-500/20 text-slate-655 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 rounded-xl text-sm font-medium transition duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
