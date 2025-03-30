import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './styles/grafanaBackground.css';

function App() {
  return (
    <Router>
      <div className="grafana-background">
        <div className="grafana-gradient-1"></div>
        <div className="grafana-gradient-2"></div>
        <div className="grafana-gradient-3"></div>
        <div className="grafana-gradient-4"></div>
        <div className="grafana-gradient-5"></div>
        <div className="grafana-stars"></div>
        <div className="grafana-big-stars"></div>
        <div className="grafana-overlay"></div>
      </div>
      
      <div className="app-content relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/j-gitlab" element={<Dashboard />} />
          <Route path="/j-jenkins" element={<Dashboard />} />
          <Route path="/j-harbor" element={<Dashboard />} />
          <Route path="/j-sonarqube" element={<Dashboard />} />
          <Route path="/j-grafana" element={<Dashboard />} />
          
          <Route path="/404" element={<NotFound />} />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;