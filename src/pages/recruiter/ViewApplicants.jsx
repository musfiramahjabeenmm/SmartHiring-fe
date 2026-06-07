import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { User, FileText, CheckCircle, XCircle, UserCheck, ExternalLink, Mail, Clock } from "lucide-react";

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (id, status) => {
    setActioningId({ id, status });
    try {
      await API.put(`/applications/${id}/status`, { status });
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
          label: "Shortlisted",
          icon: UserCheck
        };
      case "SELECTED":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          text: "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
          label: "Selected",
          icon: CheckCircle
        };
      case "REJECTED":
        return {
          bg: "bg-rose-50 dark:bg-rose-500/10",
          text: "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
          label: "Rejected",
          icon: XCircle
        };
      default:
        return {
          bg: "bg-indigo-50 dark:bg-indigo-500/10",
          text: "text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
          label: "Applied / In Review",
          icon: Clock
        };
    }
  };

  const jobTitle = applications.length > 0 ? applications[0].job?.title : "Job Listing";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Applications</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Review and manage applicants for <strong className="text-blue-600 dark:text-indigo-400">{jobTitle}</strong>.
            </p>
          </div>
          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-medium transition duration-200 cursor-pointer"
          >
            Back to My Jobs
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 relative z-10">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative z-10">
            {applications.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/40 rounded-2xl shadow-sm transition-all duration-300">
                <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">No candidates applied yet.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Applications for this position will display here once submitted.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => {
                  const statusInfo = getStatusDetails(app.status);
                  const StatusIcon = statusInfo.icon;
                  const isActioningThis = actioningId?.id === app.id;

                  return (
                    <div 
                      key={app.id} 
                      className="bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                              {app.candidate?.name ? app.candidate.name.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-slate-900 dark:text-white">{app.candidate?.name}</p>
                              {app.candidate?.email && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Mail className="h-3 w-3" />
                                  {app.candidate.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                          </span>

                          {app.resumeLink && (
                            <button
                              onClick={() => window.open(app.resumeLink, "_blank")}
                              className="text-xs text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>View Resume</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-end gap-2 transition-colors duration-200">
                        <button
                          onClick={() => handleStatusUpdate(app.id, "SHORTLISTED")}
                          disabled={isActioningThis || app.status === "SHORTLISTED"}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition duration-200 border ${
                            app.status === "SHORTLISTED"
                              ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600/70 dark:text-amber-400/70 font-semibold"
                              : "bg-slate-50 dark:bg-slate-950/80 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500/20 text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400"
                          }`}
                        >
                          {isActioningThis && actioningId.status === "SHORTLISTED" ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-amber-500 rounded-full animate-spin" />
                          ) : (
                            "Shortlist"
                          )}
                        </button>

                        <button
                          onClick={() => handleStatusUpdate(app.id, "SELECTED")}
                          disabled={isActioningThis || app.status === "SELECTED"}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition duration-200 border ${
                            app.status === "SELECTED"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600/70 dark:text-emerald-400/70 font-semibold"
                              : "bg-slate-50 dark:bg-slate-950/80 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/20 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400"
                          }`}
                        >
                          {isActioningThis && actioningId.status === "SELECTED" ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-emerald-500 rounded-full animate-spin" />
                          ) : (
                            "Select"
                          )}
                        </button>

                        <button
                          onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                          disabled={isActioningThis || app.status === "REJECTED"}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition duration-200 border ${
                            app.status === "REJECTED"
                              ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600/70 dark:text-rose-400/70 font-semibold"
                              : "bg-slate-50 dark:bg-slate-950/80 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400"
                          }`}
                        >
                          {isActioningThis && actioningId.status === "REJECTED" ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-rose-500 rounded-full animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </button>
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

export default ViewApplicants;