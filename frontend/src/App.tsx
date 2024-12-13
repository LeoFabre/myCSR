import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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
            <Link to="/requirements">Exigences</Link>
          </li>
          <li>
            <Link to="/documents">Documents</Link>
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
