import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

function Alert({ alert, style }) {
  if (!alert) return null;
  return (
    <div className={`alert alert-${alert.type}`} style={style}>
      {alert.type === "danger" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
      <span>{alert.message}</span>
    </div>
  );
}

export default Alert;
