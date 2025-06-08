import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventCalendar from './pages/EventCalendar';
import HelpContact from './pages/HelpContact';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-inter">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/events" element={<EventCalendar />} />
            <Route path="/help" element={<HelpContact />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;