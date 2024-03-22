import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/appContext";
import Login from "./views/Login";
import Home from "./views/Home";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <Header />
                <Home />
                <Footer />
              </ProtectedRoute>
            }
            path="/"
          />
          <Route element={<Login />} path="/login" />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
