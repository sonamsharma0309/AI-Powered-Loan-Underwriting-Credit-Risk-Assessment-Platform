import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RiskAnalytics from "./pages/RiskAnalytics";
import LoanAssessment from "./pages/LoanAssessment";
import Applications from "./pages/Applications";
import AuditLogs from "./pages/AuditLogs";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import MainLayout from "./layout/MainLayout";

function App() {

  const { token } = useAuth();
  const location = useLocation();

  const pageAnimation = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.25 },
  };

  const AnimatedPage = ({ children }: any) => (
    <motion.div {...pageAnimation}>{children}</motion.div>
  );

  return (

    <AnimatePresence mode="wait">

      <Routes location={location} key={location.pathname}>

        {/* PUBLIC ROUTES */}

        {!token && (
          <>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Landing />
                </AnimatedPage>
              }
            />

            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              }
            />

            <Route
              path="/register"
              element={
                <AnimatedPage>
                  <Register />
                </AnimatedPage>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/* PROTECTED ROUTES */}

        {token && (
          <Route path="/" element={<MainLayout />}>

            <Route
              index
              element={<Navigate to="/dashboard" />}
            />

            <Route
              path="dashboard"
              element={
                <AnimatedPage>
                  <Dashboard />
                </AnimatedPage>
              }
            />

            <Route
              path="assessment"
              element={
                <AnimatedPage>
                  <LoanAssessment />
                </AnimatedPage>
              }
            />

            <Route
              path="applications"
              element={
                <AnimatedPage>
                  <Applications />
                </AnimatedPage>
              }
            />

            <Route
              path="analytics"
              element={
                <AnimatedPage>
                  <RiskAnalytics />
                </AnimatedPage>
              }
            />

            <Route
              path="audit"
              element={
                <AnimatedPage>
                  <AuditLogs />
                </AnimatedPage>
              }
            />

            <Route
              path="profile"
              element={
                <AnimatedPage>
                  <Profile />
                </AnimatedPage>
              }
            />

            <Route
              path="settings"
              element={
                <AnimatedPage>
                  <Settings />
                </AnimatedPage>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" />} />

          </Route>
        )}

      </Routes>

    </AnimatePresence>
  );
}

export default App;