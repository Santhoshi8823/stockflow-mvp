import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
};

export default MainLayout;