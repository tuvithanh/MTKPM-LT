import React, { useState, useEffect } from "react";
import Header from "./constants/Header";
import AdminHeader from "./constants/AdminHeader"; // Bạn cần tạo file này (xem ở bước 2)
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import "./index.css";
import CategoryPage from "./pages/Admin/CategoryPage";
import UserManagement from "./pages/Admin/UserManagement";
import ProductPage from "./pages/Admin/ProductPage";
import UserProductPage from "./pages/UserProductPage";
import CartPage from "./pages/CartPage";

function App() {
  const [currentMode, setCurrentMode] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
    </div>
  );
}

export default App;
