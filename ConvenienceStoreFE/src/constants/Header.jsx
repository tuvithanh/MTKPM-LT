import React from "react";

// 1. Định nghĩa Strategy Data: Tách dữ liệu ra khỏi UI
const NAVIGATION_STRATEGY = [
  { label: "Trang chủ", href: "/Home" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Khuyến mãi", href: "/khuyen-mai" },
  { label: "Cửa hàng", href: "/cua-hang" },
];

function Header() {
  return (
    <header className="bg-white shadow-sm">
      {/* TOP BAR: Giữ nguyên logic của bạn */}
      <div className="h-[60px] flex items-center justify-between px-10 border-b">
        <div className="text-2xl font-bold">
          <span className="text-sky-500">Convenience</span>
          <span className="text-orange-400 ml-1">Store</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="border border-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-100 transition text-sm">
            Đăng nhập
          </button>
          <button className="border border-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-100 transition text-sm">
            Đăng ký
          </button>
          <button className="relative w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-lg shadow-sm">
            🛒
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* NAV BAR: Áp dụng mẫu Strategy để render */}
      <div className="h-[44px] bg-[#7DA8C9] flex items-center justify-center">
        <nav className="w-full max-w-[1200px] px-10 flex items-center gap-[30px] text-sm font-bold">
          {NAVIGATION_STRATEGY.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-white no-underline hover:text-orange-400 transition-colors duration-200 uppercase tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
