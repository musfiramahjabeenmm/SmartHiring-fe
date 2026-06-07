import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { MapPin, DollarSign, Calendar, Trash2, ExternalLink, Clock, CheckCircle, XCircle, UserCheck } from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    setWithdrawingId(id);
    try {
      await API.delete(`/applications/${id}/withdraw`);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-500/30",
          label: "Shortlisted",
          icon: UserCheck
        };
      case "SELECTED":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          text: "text-emerald-700 dark:text-emerald-400 border-emerald-250 dark:border-emerald-500/30",
          label: "Selected / Hired",
          icon: CheckCircle
        };
      case "REJECTED":
        return {
          bg: "bg-rose-50 dark:bg-rose-500/10",
          text: "text-rose-700 dark:text-rose-400 border-rose-250 dark:border-rose-500/30",
          label: "Rejected",
          icon: XCircle
        };
      default:
        return {
          bg: "bg-indigo-50 dark:bg-indigo-500/10",
          text: "text-indigo-700 dark:text-indigo-400 border-indigo-250 dark:border-indigo-500/30",
          label: "Applied / Pending Review",
          icon: Clock
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 relative">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Applications</h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Track the history and real-time status of your submissions.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 relative z-10">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {applications.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/40 rounded-2xl shadow-sm transition-all duration-300">
                <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-605 dark:text-slate-400 font-medium text-lg">No applications submitted yet.</p>
                <p className="text-slate-450 dark:text-slate-505 text-sm mt-1">Visit the Browse Jobs page to check active listings.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications.map((app) => {
                  const statusInfo = getStatusDetails(app.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div 
                      key={app.id} 
                      className="bg-white dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 group transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                            {app.job?.title}
                          </h3>
                        </div>

                        {/* Job Metadata tags */}
                        <div className="flex flex-wrap gap-2.5">
                          {app.job?.location && (
                            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-205">
                              <MapPin className="h-3 w-3 text-emerald-400" />
                              {app.job.location}
                            </span>
                          )}
                          {app.job?.salaryRange && (
                            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-205">
                              <DollarSign className="h-3 w-3 text-emerald-400" />
                              {app.job.salaryRange}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors duration-205">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            Applied: {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Status badge and resume link */}
                        <div className="flex flex-wrap items-center gap-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                          </span>
                          
                          {app.resumeLink && (
                            <a 
                              href={app.resumeLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 font-medium inline-flex items-center gap-1 transition duration-200"
                            >
                              <span>Attached Resume</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end">
                        {app.status === "APPLIED" && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            disabled={withdrawingId === app.id}
                            className="bg-slate-50 dark:bg-slate-900/60 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-slate-850 hover:border-red-200 dark:hover:border-red-550/20 text-slate-500 dark:text-slate-400 hover:text-red-650 dark:hover:text-red-400 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                          >
                            {withdrawingId === app.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            <span>Withdraw Application</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;