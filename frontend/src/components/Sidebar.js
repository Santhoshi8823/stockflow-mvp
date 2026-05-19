import React from "react";
import { Package, LayoutDashboard, Settings as SettingsIcon, LogOut } from "lucide-react";

function Sidebar({ currentPage, setCurrentPage, user, organizationName, handleLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container" style={{ justifyContent: "flex-start", marginBottom: "0" }}>
          <Package size={28} color="#6366f1" />
          <span className="logo-text" style={{ fontSize: "22px" }}>StockFlow</span>
          <span className="logo-badge" style={{ fontSize: "9px" }}>SaaS</span>
        </div>
        <div className="org-info">
          <div className="org-label">Current Org</div>
          <div className="org-name" title={organizationName}>{organizationName}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${currentPage === "DASHBOARD" ? "active" : ""}`}
          onClick={() => setCurrentPage("DASHBOARD")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>
        <div
          className={`nav-item ${currentPage === "PRODUCTS" ? "active" : ""}`}
          onClick={() => setCurrentPage("PRODUCTS")}
        >
          <Package size={18} />
          <span>Products & Stock</span>
        </div>
        <div
          className={`nav-item ${currentPage === "SETTINGS" ? "active" : ""}`}
          onClick={() => setCurrentPage("SETTINGS")}
        >
          <SettingsIcon size={18} />
          <span>Global Settings</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="user-details">
            <span className="user-email" title={user?.email}>{user?.email}</span>
            <span className="user-role">Owner & Admin</span>
          </div>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} style={{ padding: "8px 12px", fontSize: "13px" }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
