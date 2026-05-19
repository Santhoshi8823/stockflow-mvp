import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { apiFetch } from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(null);

  const [organizationName, setOrganizationName] = useState("");

  const [authLoading, setAuthLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setOrganizationName("");
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await apiFetch(
          "/auth/me",
          {},
          token,
          logout
        );

        setUser(res.user);
        setOrganizationName(res.organizationName);
      } catch (err) {
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);
    setOrganizationName(data.organizationName);
  };

  const signup = async (
    email,
    password,
    organizationName
  ) => {
    const res = await fetch(
      "http://localhost:5000/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          organizationName,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);
    setOrganizationName(data.organizationName);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        organizationName,
        authLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);