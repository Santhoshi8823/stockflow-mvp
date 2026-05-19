import React, { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";

function Settings({ globalSettings, handleSettingsSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleSettingsSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card animate-scale" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card-header">
        <h3 className="card-title">
          <SettingsIcon size={18} />
          <span>System Configuration</span>
        </h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Global Default Low Stock Threshold</label>
            <input
              type="number"
              name="defaultLowStockThreshold"
              className="form-control"
              style={{ paddingLeft: "14px" }}
              defaultValue={globalSettings.defaultLowStockThreshold}
              required
              min="0"
            />
            <p className="form-help">
              This global value is used as the low-stock boundary for any products that do not have an individual threshold set. A product is flagged as "Low Stock" if its Quantity on Hand is equal to or less than this value.
            </p>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "8px" }} disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
