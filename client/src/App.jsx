import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/Dashboard';
import EventManager from './components/EventManager';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 