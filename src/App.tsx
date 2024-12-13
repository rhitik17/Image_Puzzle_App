import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Puzzle from './components/Puzzle'; 
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/puzzle"
          element={
            <ProtectedRoute>
              <Puzzle />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
