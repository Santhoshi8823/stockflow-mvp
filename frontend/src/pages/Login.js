import React from "react";

import {
  Package,
  User,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Alert from "../components/Alert";

function Login({
  handleAuthSubmit,
  alert,
}) {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <Package
              size={32}
              color="#6366f1"
            />

            <span className="logo-text">
              StockFlow
            </span>

            <span className="logo-badge">
              MVP
            </span>
          </div>

          <h2 className="auth-title">
            Welcome back
          </h2>

          <p className="auth-subtitle">
            Login to manage your
            multi-tenant inventory
          </p>
        </div>

        <Alert alert={alert} />

        <form
          onSubmit={(e) =>
            handleAuthSubmit(
              e,
              "LOGIN"
            )
          }
        >
          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                <User size={18} />
              </span>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                <X
                  size={18}
                  style={{
                    transform:
                      "rotate(45deg)",
                  }}
                />
              </span>

              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              marginTop: "12px",
            }}
          >
            Sign In to Workspace
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <span
              className="auth-link"
              onClick={() =>
                navigate("/signup")
              }
            >
              Sign up free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;