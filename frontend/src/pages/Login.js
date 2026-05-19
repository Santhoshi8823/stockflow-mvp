import React from "react";

import {
  Package,
  User,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Alert from "../components/Alert";

import {
  useAuth,
} from "../context/AuthContext";

function Login({ alert }) {

  const navigate = useNavigate();

  useAuth();

  const handleAuthSubmit =
    async (e) => {

      e.preventDefault();

      const formData =
        new FormData(e.target);

      const data = {
        email:
          formData.get("email"),
        password:
          formData.get("password"),
      };

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(
                  data
                ),
            }
          );

        const result =
          await response.json();

      //  console.log(result);

        if (
          result.success
        ) {

          window.alert(
            "Login successful"
          );

          // Store user
          localStorage.setItem(
  "token",
  result.token
);

localStorage.setItem(
  "user",
  JSON.stringify(result.user)
);

          navigate("/dashboard");

        } else {

          window.alert(
            result.message
          );
        }

      } catch (error) {

    //    console.log(error);

        window.alert(
          "Something went wrong"
        );
      }
    };

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
          onSubmit={
            handleAuthSubmit
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
                navigate(
                  "/signup"
                )
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