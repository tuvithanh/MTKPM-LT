import React, { useState, useEffect } from "react";
import Header from "./constants/Header";
import AdminHeader from "./constants/AdminHeader";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import OrderSuccess from "./pages/OrderSuccess";
import "./index.css";
import CategoryPage from "./pages/Admin/CategoryPage";
import UserManagement from "./pages/Admin/UserManagement";
import ProductPage from "./pages/Admin/ProductPage";
import UserProductPage from "./pages/UserProductPage";
import CartPage from "./pages/CartPage";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

function App() {
  const [currentMode, setCurrentMode] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Detect route từ URL path
    const path = window.location.pathname;
    if (path.includes("/order-success")) {
      setCurrentMode("order-success");
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentMode("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentMode("home");
  };

  // Logic kiểm tra xem có đang ở trang quản trị không
  const isAdminPage = currentMode.startsWith("admin-");

  return (
    <div className="min-h-screen bg-white">
      {/* TOAST NOTIFICATION */}
    <Toaster position="top-right" reverseOrder={false} />
      {/* STRATEGY PATTERN: 
          Nếu mode là admin-*, hiển thị AdminHeader. Ngược lại hiển thị Header thường 
      */}
      {isAdminPage && user?.role === "ADMIN" ? (
        <AdminHeader onNavigate={setCurrentMode} onLogout={handleLogout} />
      ) : (
        <Header
          onNavigate={setCurrentMode}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <main>
        {/* TRANG NGƯỜI DÙNG THƯỜNG */}
        {currentMode === "home" && <Home user={user} />}

        {currentMode === "products" && (
          <UserProductPage onNavigate={setCurrentMode} />
        )}
        {currentMode === "cart" && <CartPage onNavigate={setCurrentMode} />}
        {currentMode === "order-success" && (
          <OrderSuccess onNavigate={setCurrentMode} />
        )}

        {(currentMode === "login" || currentMode === "register") && (
          <Auth initialMode={currentMode} onLoginSuccess={handleLoginSuccess} />
        )}

        {/* TRANG QUẢN TRỊ (Chỉ render nếu đúng Role) */}
        {user?.role === "ADMIN" && (
          <>
            {currentMode === "admin-dashboard" && (
              <div className="p-10 text-2xl font-bold">Thống kê tổng quan</div>
            )}
            {currentMode === "admin-users-management" && <UserManagement />}
            {currentMode === "admin-categories" && <CategoryPage />}
            {currentMode === "admin-products" && <ProductPage />}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
