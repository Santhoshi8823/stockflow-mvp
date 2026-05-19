import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      ) || ""
    );

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      ) || null
    );

  const [authLoading] =
    useState(false);

  // LOGIN
  const login = async (
    email,
    password
  ) => {

    const res = await fetch(
      "https://stockflow-mvp-production-62bd.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(
        data.message
      );
    }

    // Save in localStorage
    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user
      )
    );

    // Update state
    setToken(data.token);

    setUser(data.user);

    return data;
  };

  // SIGNUP
  const signup = async (
    email,
    password,
    organizationName
  ) => {

    const res = await fetch(
      "https://stockflow-mvp-production-62bd.up.railway.app/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          organizationName,
        }),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(
        data.message
      );
    }

    return data;
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken("");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
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

export const useAuth = () =>
  useContext(AuthContext);