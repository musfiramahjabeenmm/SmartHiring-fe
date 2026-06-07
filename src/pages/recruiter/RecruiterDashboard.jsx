import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { Briefcase, Users, UserCheck, TrendingUp, Sparkles, PlusCircle, ArrowRight, BarChart3 } from "lucide-react";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch the list of posted jobs
        const jobsRes = await API.get("/jobs/my");
        const jobsList = jobsRes.data || [];
        
        // Fetch applicant lists for each job in parallel
        const appsPromises = jobsList.map(job => 
          API.get(`/applications/job/${job.id}`)
            .then(res => res.data || [])
            .catch(() => [])
        );
        const appsLists = await Promise.all(appsPromises);
        
        // Calculate statistics based on actual listings and candidate counts
        const computedTotalJobs = jobsList.length;
        let computedTotalApps = 0;
        let computedShortlisted = 0;
        
        appsLists.forEach(apps => {
          computedTotalApps += apps.length;
          computedShortlisted += apps.filter(app => app.status === "SHORTLISTED").length;
        });
        
        setStats({
          totalJobs: computedTotalJobs,
          totalApplications: computedTotalApps,
          shortlistedCount: computedShortlisted
        });
      } catch (err) {
        console.error("Error computing recruiter stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalJobs = stats?.totalJobs ?? 0;
  const totalApplications = stats?.totalApplications ?? 0;
  const shortlistedCount = stats?.shortlistedCount ?? 0;

  // Calculations
  const avgAppsPerJob = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : "0.0";
  const shortlistRate = totalApplications > 0 ? ((shortlistedCount / totalApplications) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

        {/* Hero Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome, {user?.name}!
            </h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">
              Here's the real-time analytics of your recruitment pipeline.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/recruiter/post-job")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 cursor-pointer flex items-center gap-2 group"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post New Job</span>
            </button>
            <button
              onClick={() => navigate("/recruiter/jobs")}
              className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-medium transition duration-200 cursor-pointer flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              <span>Manage Jobs</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-10 relative">
              {/* Card 1: Total Jobs Posted */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Jobs Posted</span>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{totalJobs}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Active open job postings</span>
                </div>
              </div>

              {/* Card 2: Total Applications */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Applications</span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{totalApplications}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-405" />
                  <span>Average per job: <strong className="text-indigo-600 dark:text-indigo-400">{avgAppsPerJob}</strong></span>
                </div>
              </div>

              {/* Card 3: Shortlisted */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">Shortlisted</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{shortlistedCount}</p>
                <div className="mt-4 text-xs text-slate-550 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Conversion rate: <strong className="text-emerald-400">{shortlistRate}%</strong></span>
                </div>
              </div>
            </div>

            {/* Calculations & Advanced Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative">
              {/* Pipeline Funnel Widget */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between lg:col-span-2 transition-all duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hiring Pipeline Funnel</h3>
                  <div className="space-y-6">
                    {/* Stage 1: Applications */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Applications Received</span>
                        <span className="text-slate-500 dark:text-slate-400 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-4 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: "100%" }} />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                        Total application submissions across all jobs ({totalApplications})
                      </p>
                    </div>

                    {/* Stage 2: Shortlisted */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Shortlisted Stage</span>
                        <span className="text-blue-600 dark:text-indigo-400 font-bold">{shortlistRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-550 to-blue-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${shortlistRate}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                        Percentage of total applications advanced to Shortlisted ({shortlistedCount})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800/60 mt-6 pt-4 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span>Calculated based on active job stats</span>
                  <span className="text-blue-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                    Funnel Analytics v1.0
                  </span>
                </div>
              </div>

              {/* Action Board */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recruitment Actions</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Quick shortcuts to execute your hiring goals.</p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => navigate("/recruiter/post-job")}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-slate-850 hover:border-blue-200 dark:hover:border-blue-500/30 text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">Post a New Job</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Publish new hiring requirements</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-550 group-hover:text-blue-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={() => navigate("/recruiter/jobs")}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-slate-850 hover:border-blue-200 dark:hover:border-blue-500/30 text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">Manage Postings</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">View and delete posted listings</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-550 group-hover:text-blue-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-605 mt-6 text-center">
                  SmartHiring Recruiter Workspace Dashboard
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;