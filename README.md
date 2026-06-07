# Smart Hiring Portal — Frontend

A React + Vite frontend for the Smart Hiring Portal with role-based dashboards for Recruiters and Candidates.

---

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3
- React Router DOM 7
- Axios

---

## Features

### Recruiter Portal
- Post new jobs with title, description, location, salary, and dates
- View all posted jobs
- View all applicants for each job
- Shortlist, Select, or Reject candidates
- Recruiter dashboard with total jobs, applications, and shortlisted count

### Candidate Portal
- Browse all available jobs
- Apply to any job with a resume link
- Track application status (APPLIED / SHORTLISTED / SELECTED / REJECTED)
- Withdraw applications
- Candidate dashboard with application stats

### Auth
- Signup as Recruiter or Candidate
- Login with JWT token
- Auto redirect based on role after login

---

## Project Structure

```
src/
├── api/
│   └── axios.js               # Axios instance with JWT interceptor
├── context/
│   └── AuthContext.jsx        # Global auth state management
├── pages/
│   ├── auth/
│   │   ├── Login.jsx          # Login page
│   │   └── Signup.jsx         # Signup page with role selection
│   ├── recruiter/
│   │   ├── RecruiterDashboard.jsx   # Recruiter stats dashboard
│   │   ├── PostJob.jsx              # Post a new job
│   │   ├── MyJobs.jsx               # View and manage posted jobs
│   │   └── ViewApplicants.jsx       # View and manage applicants
│   └── candidate/
│       ├── CandidateDashboard.jsx   # Candidate stats dashboard
│       ├── BrowseJobs.jsx           # Browse and apply to jobs
│       └── MyApplications.jsx       # Track application statuses
├── App.jsx                    # Routes configuration
└── main.jsx                   # React entry point
```

---

## Application Routes

| Route | Component | Access |
|---|---|---|
| / | Redirect to /login | Public |
| /login | Login.jsx | Public |
| /signup | Signup.jsx | Public |
| /recruiter/dashboard | RecruiterDashboard.jsx | Recruiter |
| /recruiter/post-job | PostJob.jsx | Recruiter |
| /recruiter/jobs | MyJobs.jsx | Recruiter |
| /recruiter/applications/:jobId | ViewApplicants.jsx | Recruiter |
| /candidate/dashboard | CandidateDashboard.jsx | Candidate |
| /candidate/jobs | BrowseJobs.jsx | Candidate |
| /candidate/applications | MyApplications.jsx | Candidate |

---

## Setup

### Prerequisites

- Node.js
- Backend running on port 8081

### Steps

**1. Clone the repo**

```
git clone https://github.com/musfiramahjabeenmm/SmartHiring-fe.git
cd smart-hiring-frontend
```

**2. Install dependencies**

```
npm install
```

**3. Create .env file in root**

```
VITE_API_URL=http://localhost:8081/api
```

**4. Run the app**

```
npm run dev
```

App runs on http://localhost:5173

---

## How Auth Works

1. User logs in → backend returns JWT token + role + name
2. Token saved to localStorage
3. Axios interceptor automatically attaches token to every request
4. AuthContext stores user globally — any component can access role and name
5. User redirected to Recruiter or Candidate dashboard based on role
6. Logout clears token and user from localStorage

---

## Backend

Make sure the backend is running before starting the frontend.

Backend repo: https://github.com/musfiramahjabeenmm/SmartHiring-be.git
