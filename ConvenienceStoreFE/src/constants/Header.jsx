import React, { useState, useEffect } from "react";

const NAVIGATION_STRATEGY = [
  { label: "Trang chủ", mode: "home" },
  { label: "Sản phẩm", mode: "products" },
  { label: "Khuyến mãi", mode: "offers" },
  { label: "Cửa hàng", mode: "stores" },
];

function Header({ onNavigate, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Lấy số lượng sản phẩm trong giỏ hàng từ localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    // Lắng nghe sự kiện storage để cập nhật số lượng khi thêm hàng ở trang khác
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <header className="bg-white shadow-sm relative">
      <div className="h-[60px] flex items-center justify-between px-10 border-b">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => onNavigate("home")}
        >
          <span className="text-sky-500">Convenience</span>
          <span className="text-orange-400 ml-1">Store</span>
        </div>

        <div className="flex items-center gap-6">
          {/* ICON GIỎ HÀNG */}
          <div
            className="relative cursor-pointer group"
            onClick={() => onNavigate("cart")}
          >
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-2xl">🛒</span>
            </div>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
            {/* Tooltip nhỏ khi hover */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Giỏ hàng
            </span>
          </div>

          {user ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold border-2 border-sky-100 hover:shadow-md transition-shadow">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">
                        {user.username}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tight">
                        {user.role}
                      </p>
                    </div>

                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => {
                          onNavigate("admin-dashboard");
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-sky-600 font-bold hover:bg-sky-50"
                      >
                        🚀 Trang Quản Trị
                      </button>
                    )}

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="border border-sky-500 text-sky-500 px-5 py-1.5 rounded-full text-sm font-bold hover:bg-sky-500 hover:text-white transition-all"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      <div className="h-[44px] bg-[#7DA8C9] flex items-center justify-center">
        <nav className="w-full max-w-[1200px] px-10 flex items-center gap-[30px] text-sm font-bold text-white uppercase">
          {NAVIGATION_STRATEGY.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.mode)}
              className="hover:text-orange-400 transition-colors bg-transparent border-none cursor-pointer font-bold text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
export default Header;
