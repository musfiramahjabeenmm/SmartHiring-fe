import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { 
  FileText, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Activity, 
  Zap, 
  Compass, 
  Clock 
} from "lucide-react";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch candidate's applications list
        const res = await API.get("/applications/my");
        const appsList = res.data || [];
        
        // Calculate status counts based on actual applications
        const computedTotal = appsList.length;
        const computedShortlisted = appsList.filter(app => app.status === "SHORTLISTED").length;
        const computedSelected = appsList.filter(app => app.status === "SELECTED").length;
        const computedRejected = appsList.filter(app => app.status === "REJECTED").length;
        
        setStats({
          totalApplied: computedTotal,
          shortlisted: computedShortlisted,
          selected: computedSelected,
          rejected: computedRejected
        });
      } catch (err) {
        console.error("Error computing candidate stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total = stats?.totalApplied ?? 0;
  const shortlisted = stats?.shortlisted ?? 0;
  const selected = stats?.selected ?? 0;
  const rejected = stats?.rejected ?? 0;
  
  // Advanced calculations
  const shortlistRate = total > 0 ? ((shortlisted / total) * 100).toFixed(1) : "0.0";
  const selectionRate = total > 0 ? ((selected / total) * 100).toFixed(1) : "0.0";
  const responseRate = total > 0 ? (((shortlisted + selected + rejected) / total) * 100).toFixed(1) : "0.0";
  const inProgress = Math.max(0, total - selected - rejected);

  // SVG calculations for a circular gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const selectionPercentage = Math.min(100, Math.max(0, parseFloat(selectionRate)));
  const strokeDashoffset = circumference - (selectionPercentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none" />

        {/* Hero Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome Back, {user?.name}!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Here's the summary of your application pipeline and match ratings.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/candidate/jobs")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 cursor-pointer flex items-center gap-2 group"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Jobs</span>
            </button>
            <button
              onClick={() => navigate("/candidate/applications")}
              className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-medium transition duration-200 cursor-pointer flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>My Applications</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10 relative">
              {/* Card 1: Total Applied */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Total Applied</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{total}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Your total active and closed listings</span>
                </div>
              </div>

              {/* Card 2: Shortlisted */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Shortlisted</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{shortlisted}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Success rate: <strong className="text-amber-400">{shortlistRate}%</strong></span>
                </div>
              </div>

              {/* Card 3: Selected */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Selected</span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{selected}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                  <span>Selection rate: <strong className="text-blue-400">{selectionRate}%</strong></span>
                </div>
              </div>

              {/* Card 4: Rejected */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-rose-500/5 blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Rejected</span>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{rejected}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-rose-400" />
                  <span>In-progress status: <strong className="text-slate-500 dark:text-slate-400">{inProgress} active</strong></span>
                </div>
              </div>
            </div>

            {/* Calculations & Advanced Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative">
              {/* Radial Donut Gauge */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between items-center text-center transition-all duration-300">
                <div className="w-full text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Selection Success Rate</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Percentage of applications leading to employment offers</p>
                </div>
                
                <div className="relative flex items-center justify-center my-6">
                  <svg className="w-36 h-36 transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="stroke-slate-200 dark:stroke-slate-850"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Foreground Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="stroke-emerald-500"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{selectionRate}%</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Selected</p>
                  </div>
                </div>

                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Selected ({selected})
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" /> Others ({total - selected})
                  </span>
                </div>
              </div>

              {/* Conversion Stats Breakdown */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between lg:col-span-2 transition-all duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Application Analytics</h3>
                  <div className="space-y-6">
                    {/* Metric 1: Response Rate */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Recruiter Response Rate</span>
                        <span className="text-emerald-400 font-bold">{responseRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${responseRate}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                        Percentage of applications that have received review feedback (Shortlisted, Selected, or Rejected)
                      </p>
                    </div>

                    {/* Metric 2: Shortlist Success Rate */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Shortlist Rate</span>
                        <span className="text-amber-400 font-bold">{shortlistRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${shortlistRate}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                        Percentage of total submissions resulting in candidates advancing to the shortlist stage
                      </p>
                    </div>

                    {/* Funnel Ratios */}
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/60 mt-4 text-center">
                      <div>
                        <span className="text-[10px] text-slate-550 dark:text-slate-400 uppercase tracking-wider block">In Review</span>
                        <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                          {total > 0 ? ((inProgress / total) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-550 dark:text-slate-400 uppercase tracking-wider block">Shortlisted / App</span>
                        <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                          {total > 0 ? (shortlisted / total).toFixed(2) : 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-550 dark:text-slate-400 uppercase tracking-wider block">Selected / Shortlist</span>
                        <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                          {shortlisted > 0 ? (selected / shortlisted).toFixed(2) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;