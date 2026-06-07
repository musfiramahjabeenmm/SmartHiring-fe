import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { Search, MapPin, DollarSign, Calendar, Send, X, FileText, CheckCircle } from "lucide-react";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [applyingJob, setApplyingJob] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs/all");
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  // Filter logic
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const loc = locationQuery.toLowerCase();
    const filtered = jobs.filter((job) => {
      const matchKeyword = 
        job.title.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query);
      const matchLocation = 
        !loc || (job.location && job.location.toLowerCase().includes(loc));
      return matchKeyword && matchLocation;
    });
    setFilteredJobs(filtered);
  }, [searchQuery, locationQuery, jobs]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeLink.trim()) return;
    setSubmitting(true);
    try {
      await API.post(`/applications/apply/${applyingJob.id}`, { resumeLink });
      setMessage("Application submitted successfully!");
      setMessageType("success");
      setApplyingJob(null);
      setResumeLink("");
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (err) {
      setMessage("Failed to apply. You may have already applied to this job.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore Opportunities</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Find the next step in your professional career.</p>
        </div>

        {/* Toast Notification */}
        {message && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl animate-slide-in backdrop-blur-xl ${
            messageType === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-250 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-500/10 border-red-250 dark:border-red-500/30 text-red-800 dark:text-red-300"
          }`}>
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{message}</span>
          </div>
        )}

        {/* Search and Filter Container */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 relative z-10 transition-all duration-300">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search by role, keyword, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
            />
          </div>

          {/* Location Filter */}
          <div className="relative md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Location..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="relative z-10">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/40 rounded-2xl shadow-sm transition-all duration-300">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-605 dark:text-slate-400 font-medium text-lg">No jobs matching your criteria.</p>
              <p className="text-slate-450 dark:text-slate-500 text-sm mt-1">Try modifying your search or location keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                        {job.title}
                      </h3>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2.5 mt-3">
                      {job.location && (
                        <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-350">
                          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                          {job.location}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-350">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                          {job.salaryRange}
                        </span>
                      )}
                      {job.closingDate && (
                        <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-355">
                          <Calendar className="h-3.5 w-3.5 text-slate-505" />
                          Closes: {job.closingDate}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between transition-all duration-300">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Posted recently
                    </span>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white px-4 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:border-transparent dark:hover:border-transparent transition-all duration-300 cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Drawer/Modal Overlay */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setApplyingJob(null)}
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-scale-up transition-all duration-300">
            <button
              onClick={() => setApplyingJob(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-755 dark:hover:text-slate-300 transition duration-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-550 dark:text-emerald-400">Application Form</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Applying for {applyingJob.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                {applyingJob.location} • {applyingJob.salaryRange}
              </p>
            </div>

            <form onSubmit={handleApply} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Resume or Portfolio Link
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FileText className="h-5 w-5" />
                  </span>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/... or portfolio site"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Provide a valid URL (Google Drive, Dropbox, or custom site) containing your CV.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;