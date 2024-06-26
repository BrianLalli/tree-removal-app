import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/appContext";
import Login from "./views/Login";
import Home from "./views/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "../src/layout";
import WorkingBoard from "./views/WorkingBoard";
import Calendar from "./views/Calendar"; // Make sure this path is correct
import Invoice from "./views/Invoice";

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
          <Route element={<Invoice />} path="/invoice/:invoiceId" />
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
          <Route
            element={
              <ProtectedRoute>
                <Layout>
                  <Calendar />
                </Layout>
              </ProtectedRoute>
            }
            path="/calendar"
          />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
