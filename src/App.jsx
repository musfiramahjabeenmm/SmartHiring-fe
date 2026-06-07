import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import MyJobs from "./pages/recruiter/MyJobs";
import ViewApplicants from "./pages/recruiter/ViewApplicants";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import BrowseJobs from "./pages/candidate/BrowseJobs";
import MyApplications from "./pages/candidate/MyApplications";


const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/post-job" element={<PostJob />} />
            <Route path="/recruiter/jobs" element={<MyJobs />} />
            <Route path="/recruiter/applications/:jobId" element={<ViewApplicants />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/jobs" element={<BrowseJobs />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;