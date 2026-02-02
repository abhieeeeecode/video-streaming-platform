import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Navbar from "./components/Navbar";
import { getToken } from "./auth";

function App() {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <BrowserRouter>
      {/* TOP NAVBAR */}
      {token && <Navbar />}

      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* UPLOAD (ADMIN ONLY – UI HANDLED INSIDE PAGE) */}
        <Route
          path="/upload"
          element={token ? <Upload /> : <Navigate to="/" />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
