import React from "react";
import { Package, TrendingUp, AlertTriangle, CheckCircle2, Plus } from "lucide-react";

function Dashboard({ dashboardData, handleOpenAddModal, setCurrentPage }) {
  return (
    <div>
      {/* Stat Cards Row */}
      <div className="stats-grid animate-fade">
        <div className="stat-card stat-card-indigo">
          <div className="stat-header">
            <span className="stat-label">Total Unique Products</span>
            <div className="stat-icon-wrapper stat-icon-wrapper-indigo"><Package size={20} /></div>
          </div>
          <div className="stat-value">{dashboardData.totalProducts}</div>
        </div>

        <div className="stat-card stat-card-emerald">
          <div className="stat-header">
            <span className="stat-label">Stock Units on Hand</span>
            <div className="stat-icon-wrapper stat-icon-wrapper-emerald"><TrendingUp size={20} /></div>
          </div>
          <div className="stat-value">{dashboardData.totalStock}</div>
        </div>

        <div className="stat-card stat-card-rose">
          <div className="stat-header">
            <span className="stat-label">Low Stock Alerts</span>
            <div className="stat-icon-wrapper stat-icon-wrapper-rose"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-value">{dashboardData.lowStockItemsCount}</div>
        </div>
      </div>

      {/* Dashboard Panels */}
      <div className="dashboard-sections animate-scale">
        {/* Low Stock Items Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <AlertTriangle size={18} color="var(--danger)" />
              <span>Low Stock Items Alert</span>
            </h3>
            <span className="badge badge-danger">{dashboardData.lowStockItemsCount} Items</span>
          </div>
          <div className="card-body" style={{ padding: "0" }}>
            {dashboardData.lowStockItems.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={48} className="empty-state-icon" style={{ color: "var(--success)" }} />
                <h4 className="empty-state-title">Stock Status Ideal</h4>
                <p className="empty-state-description">All products meet or exceed their specified stock thresholds.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Quantity</th>
                      <th>Threshold</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.lowStockItems.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: "600" }}>{p.name}</td>
                        <td><code style={{ background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{p.sku}</code></td>
                        <td style={{ color: "var(--danger)", fontWeight: "700" }}>{p.quantity} units</td>
                        <td style={{ color: "var(--text-muted)" }}>{p.lowStockThreshold} units</td>
                        <td>
                          <span className="badge badge-danger">Critical</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions dashboard sidebar */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
            <button className="btn btn-outline" onClick={() => setCurrentPage("PRODUCTS")}>
              <span>View Full Inventory</span>
            </button>
            <button className="btn btn-outline" onClick={() => setCurrentPage("SETTINGS")}>
              <span>Configure Thresholds</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
