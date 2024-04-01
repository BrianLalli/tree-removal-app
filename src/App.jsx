import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/appContext';
import Login from './views/Login';
import Home from './views/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from '../src/layout';
import WorkingBoard from './views/WorkingBoard';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
            path="/"
          />
          <Route element={<Login />} path="/login" />
          <Route
            element={
              <ProtectedRoute>
                <Layout>
                  <WorkingBoard />
                </Layout>
              </ProtectedRoute>
            }
            path="/working-board"
          />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
