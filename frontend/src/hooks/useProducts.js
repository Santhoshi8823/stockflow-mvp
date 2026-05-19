import { useState } from "react";

import { apiFetch } from "../api/apiClient";

export const useProducts = (
  token,
  logout,
  showAlert
) => {
  const [products, setProducts] = useState([]);

  const [dashboardData, setDashboardData] =
    useState({
      totalProducts: 0,
      totalStock: 0,
      lowStockItemsCount: 0,
      lowStockItems: [],
    });

  const [globalSettings, setGlobalSettings] =
    useState({
      defaultLowStockThreshold: 5,
    });

  const [dataLoading, setDataLoading] =
    useState(false);

  const loadAppData = async () => {
    if (!token) return;

    setDataLoading(true);

    try {
      const prods = await apiFetch(
        "/products",
        {},
        token,
        logout
      );

      const settings = await apiFetch(
        "/settings",
        {},
        token,
        logout
      );

      const dash = await apiFetch(
        "/dashboard",
        {},
        token,
        logout
      );

      setProducts(prods);
      setGlobalSettings(settings);
      setDashboardData(dash);
    } catch (err) {
      showAlert(
        "danger",
        err.message
      );
    } finally {
      setDataLoading(false);
    }
  };

  return {
    products,
    setProducts,
    dashboardData,
    globalSettings,
    dataLoading,
    loadAppData,
  };
};