import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { Briefcase, MapPin, DollarSign, Calendar, Send, Eye, Sparkles } from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary_range: "",
    opened_date: "",
    closing_date: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await API.post("/jobs/post", form);
      setSuccess("Job posted successfully!");
      setTimeout(() => navigate("/recruiter/jobs"), 1500);
    } catch (err) {
      setError("Failed to post job. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Post a New Position</h2>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1">Publish a job listing to attract and review top-tier candidates.</p>
        </div>

        {/* Layout Grid: Form (Left) vs Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Post Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-xl transition-all duration-300">
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-200 text-sm px-4 py-3 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-sm px-4 py-3 rounded-xl mb-6 text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Job Title
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Senior Staff Software Engineer"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Job Description & Requirements
                </label>
                <textarea
                  name="description"
                  placeholder="Provide details about the role, technical requirements, and core responsibilities..."
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. San Francisco, CA (Hybrid)"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Salary Range
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <DollarSign className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="salary_range"
                      placeholder="e.g. $140,000 - $180,000"
                      value={form.salary_range}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Opening Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="h-5 w-5" />
                    </span>
                    <input
                      type="date"
                      name="opened_date"
                      value={form.opened_date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white transition duration-200 dark:[color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Closing Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="h-5 w-5" />
                    </span>
                    <input
                      type="date"
                      name="closing_date"
                      value={form.closing_date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white transition duration-200 dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Publish Listing</span>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Live Preview Pane (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 px-2">
              <Eye className="h-4 w-4 text-blue-500 dark:text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Card Preview</span>
            </div>

            <div className="bg-white dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200 dark:border-indigo-500/10 p-6 rounded-3xl shadow-2xl relative group overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/[0.02] blur-xl pointer-events-none" />
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight min-h-[1.75rem]">
                  {form.title || <span className="text-slate-400 dark:text-slate-600 italic">Job title goes here...</span>}
                </h3>

                {/* Metadata preview tags */}
                <div className="flex flex-wrap gap-2.5 mt-3 min-h-[2rem]">
                  {form.location && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors duration-200">
                      <MapPin className="h-3 w-3 text-blue-500 dark:text-indigo-400" />
                      {form.location}
                    </span>
                  )}
                  {form.salary_range && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors duration-200">
                      <DollarSign className="h-3 w-3 text-blue-500 dark:text-indigo-400" />
                      {form.salary_range}
                    </span>
                  )}
                  {form.closing_date && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors duration-200">
                      <Calendar className="h-3 w-3" />
                      Closes: {form.closing_date}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-405 text-sm mt-4 leading-relaxed min-h-[4.5rem] whitespace-pre-line break-words">
                  {form.description || <span className="text-slate-400 dark:text-slate-600 italic">Job requirements and description text will display here as you type...</span>}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between transition-all duration-300">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-blue-500 dark:text-indigo-400" />
                  Live Preview mode
                </span>
                
                <button
                  type="button"
                  disabled
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-400 dark:text-slate-550 px-4 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PostJob;