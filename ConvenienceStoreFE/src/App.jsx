import React, { useState, useEffect } from "react";
import Header from "./constants/Header";
import AdminHeader from "./constants/AdminHeader"; // Bạn cần tạo file này (xem ở bước 2)
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import "./index.css";

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

        {(currentMode === "login" || currentMode === "register") && (
          <Auth initialMode={currentMode} onLoginSuccess={handleLoginSuccess} />
        )}

        {/* TRANG QUẢN TRỊ (Chỉ render nếu đúng Role) */}
        {user?.role === "ADMIN" && (
          <>
            {currentMode === "admin-dashboard" && (
              <div className="p-10 text-2xl font-bold">Thống kê tổng quan</div>
            )}
            {currentMode === "admin-users" && (
              <div className="p-10 text-2xl font-bold">Quản lý Người dùng</div>
            )}
            {currentMode === "admin-accounts" && (
              <div className="p-10 text-2xl font-bold">Quản lý Tài khoản</div>
            )}
            {currentMode === "admin-categories" && (
              <div className="p-10 text-2xl font-bold">Quản lý Danh mục</div>
            )}
            {currentMode === "admin-products" && (
              <div className="p-10 text-2xl font-bold">Quản lý Sản phẩm</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
