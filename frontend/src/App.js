import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import LeadsGrid from './components/LeadsGrid';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/leads" /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute>
                <LeadsGrid />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;