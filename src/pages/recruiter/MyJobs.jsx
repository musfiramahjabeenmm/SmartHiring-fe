import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { MapPin, DollarSign, Calendar, Users, Trash2, Plus, Briefcase } from "lucide-react";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs/my");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Posted Jobs</h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Manage and track your active job listings.</p>
          </div>
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 relative z-10">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative z-10">
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900/10 border border-slate-205 dark:border-slate-800/40 rounded-2xl shadow-sm transition-all duration-300">
                <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-605 dark:text-slate-400 font-medium text-lg">No jobs posted yet.</p>
                <p className="text-slate-450 dark:text-slate-500 text-sm mt-1">Click "Post New Job" above to create your first posting.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h3>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap gap-2.5 mt-3">
                        {job.location && (
                          <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors duration-200">
                            <MapPin className="h-3.5 w-3.5 text-blue-500 dark:text-indigo-400" />
                            {job.location}
                          </span>
                        )}
                        {job.salaryRange && (
                          <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors duration-200">
                            <DollarSign className="h-3.5 w-3.5 text-blue-500 dark:text-indigo-400" />
                            {job.salaryRange}
                          </span>
                        )}
                        {job.closingDate && (
                          <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors duration-200">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            Closes: {job.closingDate}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-105 dark:border-slate-900/60 flex items-center justify-between transition-all duration-300">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Posted recently
                      </span>
                      
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => navigate(`/recruiter/applications/${job.id}`)}
                          className="bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30 hover:border-transparent text-blue-600 dark:text-blue-400 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                        >
                          <Users className="h-3.5 w-3.5" />
                          <span>View Applicants</span>
                        </button>

                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="bg-slate-100 dark:bg-slate-900/80 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-650 dark:hover:text-red-400 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          {deletingId === job.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;