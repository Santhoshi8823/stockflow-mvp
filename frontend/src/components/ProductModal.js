import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

function ProductModal({ isOpen, onClose, editingProduct, onSubmit, defaultLowStockThreshold }) {
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: ""
  });

  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        name: editingProduct.name,
        sku: editingProduct.sku,
        description: editingProduct.description || "",
        quantity: editingProduct.quantity,
        costPrice: editingProduct.costPrice !== null ? editingProduct.costPrice : "",
        sellingPrice: editingProduct.sellingPrice !== null ? editingProduct.sellingPrice : "",
        lowStockThreshold: editingProduct.lowStockThreshold !== null ? editingProduct.lowStockThreshold : ""
      });
    } else {
      setProductForm({
        name: "",
        sku: "",
        description: "",
        quantity: 0,
        costPrice: "",
        sellingPrice: "",
        lowStockThreshold: ""
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(productForm);
  };

  return (
    <div className="modal-overlay">
      <div className="modal animate-scale">
        <div className="modal-header">
          <h3 className="modal-title">
            {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Product"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: "14px" }}
                placeholder="e.g., Wireless Mechanical Keyboard"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SKU Code *</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  placeholder="e.g., KEY-MECH-87"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  required
                />
                <p className="form-help">Unique product identifier.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity on Hand</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  placeholder="0"
                  min="0"
                  value={productForm.quantity}
                  onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cost Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  placeholder="0.00"
                  min="0"
                  value={productForm.costPrice}
                  onChange={(e) => setProductForm({ ...productForm, costPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  placeholder="0.00"
                  min="0"
                  value={productForm.sellingPrice}
                  onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Individual Low Stock Threshold</label>
              <input
                type="number"
                className="form-control"
                style={{ paddingLeft: "14px" }}
                placeholder="Use global default"
                min="0"
                value={productForm.lowStockThreshold}
                onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: e.target.value })}
              />
              <p className="form-help">Leave blank to use the global setting (currently {defaultLowStockThreshold}).</p>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                style={{ paddingLeft: "14px", height: "80px", resize: "none" }}
                placeholder="Short product details, variant info, or specifications..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              style={{ width: "auto" }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
