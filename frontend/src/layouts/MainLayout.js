import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Map pathnames to pages for the Sidebar active state
  let currentPage = "DASHBOARD";
  let title = "Dashboard Overview";

  if (location.pathname === "/products") {
    currentPage = "PRODUCTS";
    title = "Inventory Catalog";
  } else if (location.pathname === "/settings") {
    currentPage = "SETTINGS";
    title = "System Configuration";
  }

  const setCurrentPage = (page) => {
    if (page === "DASHBOARD") navigate("/dashboard");
    if (page === "PRODUCTS") navigate("/products");
    if (page === "SETTINGS") navigate("/settings");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        organizationName={user?.organizationName || "My Organization"}
        handleLogout={handleLogout}
      />
      <main className="main-content">
        <div className="top-bar">
          <div className="page-title-area">
            <h2 className="page-title">{title}</h2>
          </div>
        </div>
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;