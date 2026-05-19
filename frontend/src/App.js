import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import {
  AlertProvider,
  useAlert,
} from "./context/AlertContext";

import ProtectedRoute from "./routes/ProtectedRoute";

import Alert from "./components/Alert";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

// Hooks, Modals, API
import { useProducts } from "./hooks/useProducts";
import ProductModal from "./components/ProductModal";
import { apiFetch } from "./api/apiClient";

function AppRoutes() {
  const { token, logout, authLoading } = useAuth();

  const { alert, showAlert } = useAlert();

  const navigate = useNavigate();

  const setCurrentPage = (page) => {
    if (page === "DASHBOARD" || page === "dashboard") navigate("/dashboard");
    if (page === "PRODUCTS" || page === "products") navigate("/products");
    if (page === "SETTINGS" || page === "settings") navigate("/settings");
  };

  const {
    products,
    dashboardData,
    globalSettings,
    loadAppData,
  } = useProducts(token, logout, showAlert);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);

  // Load app data when token is available
  React.useEffect(() => {
    if (token) {
      loadAppData();
    }
  }, [token]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (formData) => {
    try {
      const url = editingProduct ? `/products/${editingProduct.id}` : "/products";
      const method = editingProduct ? "PUT" : "POST";
      await apiFetch(url, { method, body: JSON.stringify(formData) }, token, logout);
      showAlert("success", editingProduct ? "Product updated successfully!" : "Product created successfully!");
      handleModalClose();
      loadAppData();
    } catch (err) {
      showAlert("danger", err.message);
    }
  };

  const handleProductDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await apiFetch(`/products/${productId}`, { method: "DELETE" }, token, logout);
        showAlert("success", "Product deleted successfully!");
        loadAppData();
      } catch (err) {
        showAlert("danger", err.message);
      }
    }
  };

  const handleInlineStockAdjustSubmit = async (productId, adjustmentString) => {
    const adjustment = parseInt(adjustmentString);
    if (isNaN(adjustment)) {
      showAlert("danger", "Please enter a valid stock quantity adjustment.");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newQty = product.quantity + adjustment;
    if (newQty < 0) {
      showAlert("danger", "Stock quantity cannot drop below 0.");
      return;
    }

    try {
      await apiFetch(
        `/products/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...product, quantity: newQty }),
        },
        token,
        logout
      );
      showAlert("success", "Stock adjusted successfully!");
      loadAppData();
    } catch (err) {
      showAlert("danger", err.message);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const val = e.target.elements.defaultLowStockThreshold.value;
    try {
      await apiFetch(
        "/settings",
        {
          method: "PUT",
          body: JSON.stringify({ defaultLowStockThreshold: val }),
        },
        token,
        logout
      );
      showAlert("success", "System configuration saved successfully!");
      loadAppData();
    } catch (err) {
      showAlert("danger", err.message);
    }
  };

  // Loading screen while verifying session
  if (authLoading) {
    return (
      <div className="auth-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border:
                "4px solid rgba(255,255,255,0.1)",
              borderTop:
                "4px solid #6366f1",
              borderRadius: "50%",
              animation:
                "spin 1s linear infinite",
            }}
          ></div>

          <p
            style={{
              color: "#9ca3af",
              fontFamily:
                "Plus Jakarta Sans",
            }}
          >
            Securing connection to
            StockFlow...
          </p>

          <style>
            {`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }

                100% {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* GLOBAL ALERT */}
      <div className="alert-container">
        <Alert alert={alert} />
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingProduct={editingProduct}
        onSubmit={handleProductSubmit}
        defaultLowStockThreshold={globalSettings.defaultLowStockThreshold}
      />

      <Routes>
        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/login"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Signup />
            )
          }
        />

        {/* ========================= */}
        {/* PROTECTED ROUTES */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                dashboardData={dashboardData}
                handleOpenAddModal={handleOpenAddModal}
                setCurrentPage={setCurrentPage}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products
                products={products}
                globalSettings={globalSettings}
                handleOpenAddModal={handleOpenAddModal}
                handleOpenEditModal={handleOpenEditModal}
                handleProductDelete={handleProductDelete}
                handleInlineStockAdjustSubmit={handleInlineStockAdjustSubmit}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings
                globalSettings={globalSettings}
                handleSettingsSubmit={handleSettingsSubmit}
              />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* DEFAULT ROUTE */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                token
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;