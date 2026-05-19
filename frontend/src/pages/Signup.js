import React from "react";

import {
  Package,
  User,
  TrendingUp,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Alert from "../components/Alert";

function Signup({
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
            Create your workspace
          </h2>

          <p className="auth-subtitle">
            Spin up your custom
            inventory dashboard
            instantly
          </p>
        </div>

        <Alert alert={alert} />

        <form
          onSubmit={(e) =>
            handleAuthSubmit(
              e,
              "SIGNUP"
            )
          }
        >
          <div className="form-group animate-fade">
            <label className="form-label">
              Organization Name
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                <TrendingUp size={18} />
              </span>

              <input
                type="text"
                name="organizationName"
                className="form-control"
                placeholder="e.g., Apex Retailers"
                required
              />
            </div>
          </div>

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

          <div className="form-group animate-fade">
            <label className="form-label">
              Confirm Password
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
                name="confirmPassword"
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
            Launch Workspace
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have a
            workspace?{" "}
            <span
              className="auth-link"
              onClick={() =>
                navigate("/login")
              }
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;