import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Puzzle from "./components/Puzzle";
import ProtectedRoute from "./components/ProtectedRoute";
import { PuzzleProvider } from "./context/PuzzleContext";
import { AuthProvider } from "./context/AuthContext";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
     
          <Route path="/login" element={<Login />} />
          <Route
            path="/puzzle"
            element={
              <ProtectedRoute>
                <PuzzleProvider>
                  <Puzzle />
                </PuzzleProvider>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
