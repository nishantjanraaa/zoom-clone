import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Chats from "./pages/Chats";
import VideoRoom from "./pages/VideoRoom";
import Auth from "./pages/Auth";

// 🔐 Protected Route (only logged-in users)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

// 🔁 Redirect if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🟢 Public Route (Login/Register) */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } 
        />

        {/* 🔐 Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/chats/:groupId" 
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/room/:roomId" 
          element={
            <ProtectedRoute>
              <VideoRoom />
            </ProtectedRoute>
          } 
        />

        {/* 🔁 Default Route */}
        <Route path="/" element={<Navigate to="/auth" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;