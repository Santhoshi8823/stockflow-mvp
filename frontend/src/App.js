import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import {
  AlertProvider,
  useAlert,
} from "./context/AlertContext";

import ProtectedRoute from "./routes/ProtectedRoute";

import Alert from "./components/Alert";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

function AppRoutes() {
  const { token, authLoading } = useAuth();

  const { alert } = useAlert();

  // Loading screen while verifying session
  if (authLoading) {
    return (
      <div className="auth-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border:
                "4px solid rgba(255,255,255,0.1)",
              borderTop:
                "4px solid #6366f1",
              borderRadius: "50%",
              animation:
                "spin 1s linear infinite",
            }}
          ></div>

          <p
            style={{
              color: "#9ca3af",
              fontFamily:
                "Plus Jakarta Sans",
            }}
          >
            Securing connection to
            StockFlow...
          </p>

          <style>
            {`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }

                100% {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* GLOBAL ALERT */}
      <Alert alert={alert} />

      <Routes>
        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/login"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Signup />
            )
          }
        />

        {/* ========================= */}
        {/* PROTECTED ROUTES */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* DEFAULT ROUTE */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                token
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;