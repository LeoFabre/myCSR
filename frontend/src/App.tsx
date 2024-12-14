import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import RequirementsPage from './pages/RequirementsPage';
import DocumentsPage from './pages/DocumentsPage';
import './App.css';

const App: React.FC = () => {
  console.log('App component rendered');
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/requirements"
              className={({ isActive }) => (isActive || window.location.pathname === '/') ? 'active-link' : ''}
            >
              Requirements
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/documents"
              className={({ isActive }) => isActive ? 'active-link' : ''}
            >
              Documents
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/" element={<RequirementsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
