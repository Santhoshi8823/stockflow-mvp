import React, { useState } from "react";
import { Package, Search, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, X } from "lucide-react";

function Products({
  products = [],
  globalSettings = {},
  handleOpenAddModal,
  handleOpenEditModal,
  handleProductDelete,
  handleInlineStockAdjustSubmit,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustingProductId, setAdjustingProductId] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");

  // Client-side search logic
  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  // Render Low Stock Badge Helper
  const getLowStockBadge = (quantity, threshold) => {
    const limit = threshold !== null ? threshold : globalSettings.defaultLowStockThreshold;
    if (quantity <= limit) {
      return (
        <span className="badge badge-danger">
          <AlertTriangle size={12} /> Low Stock
        </span>
      );
    }
    return (
      <span className="badge badge-success">
        <CheckCircle2 size={12} /> Adequate
      </span>
    );
  };

  const handleAdjustFormSubmit = (e, productId) => {
    e.preventDefault();
    handleInlineStockAdjustSubmit(productId, adjustAmount);
    setAdjustingProductId(null);
    setAdjustAmount("");
  };

  return (
    <div className="card animate-scale">
      <div className="card-header" style={{ borderBottom: "none", paddingBottom: "0" }}>
        <h3 className="card-title">Inventory Catalog</h3>
        <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ width: "auto" }}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="card-body">
        {/* Search Bar */}
        <div className="action-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search catalog by SKU or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          </div>
        </div>

        {/* Table */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-state-icon" />
            <h4 className="empty-state-title">No products found</h4>
            <p className="empty-state-description">
              {searchQuery ? "Refine your search filter or SKU code." : "Create your very first stock item to begin logging sales and metrics!"}
            </p>
            {!searchQuery && (
              <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ width: "auto" }}>
                <Plus size={18} />
                <span>Add First Product</span>
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity on Hand</th>
                  <th>Selling Price</th>
                  <th>Cost Price</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isAdjusting = adjustingProductId === p.id;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: "600" }}>{p.name}</div>
                        {p.description && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <code style={{ background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                          {p.sku}
                        </code>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {isAdjusting ? (
                          <form
                            onSubmit={(e) => handleAdjustFormSubmit(e, p.id)}
                            style={{ display: "flex", gap: "6px", alignItems: "center" }}
                          >
                            <input
                              type="number"
                              className="form-control"
                              placeholder="+/- qty"
                              value={adjustAmount}
                              onChange={(e) => setAdjustAmount(e.target.value)}
                              style={{ width: "90px", padding: "6px 8px", fontSize: "12px", background: "var(--bg-main)" }}
                              autoFocus
                              required
                            />
                            <button type="submit" className="btn btn-primary" style={{ width: "auto", padding: "6px 12px", fontSize: "11px" }}>
                              Apply
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => { setAdjustingProductId(null); setAdjustAmount(""); }}
                              style={{ width: "auto", padding: "6px 8px", fontSize: "11px" }}
                            >
                              <X size={12} />
                            </button>
                          </form>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <strong style={{ fontSize: "15px" }}>{p.quantity}</strong>
                            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>units</span>
                            <button
                              className="adjust-stock-btn"
                              onClick={() => {
                                setAdjustingProductId(p.id);
                                setAdjustAmount("");
                              }}
                            >
                              Adjust Stock
                            </button>
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: "500" }}>
                        {p.sellingPrice !== null ? `$${p.sellingPrice.toFixed(2)}` : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {p.costPrice !== null ? `$${p.costPrice.toFixed(2)}` : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td>
                        {getLowStockBadge(p.quantity, p.lowStockThreshold)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="btn btn-outline"
                            style={{ padding: "6px", width: "auto" }}
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleProductDelete(p.id, p.name)}
                            className="btn btn-outline"
                            style={{ padding: "6px", width: "auto", borderColor: "rgba(239, 68, 68, 0.2)", color: "var(--danger)" }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
