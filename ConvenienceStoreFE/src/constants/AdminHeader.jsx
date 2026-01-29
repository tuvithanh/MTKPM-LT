import React from "react";

const ADMIN_NAV_STRATEGY = [
  { label: "Dashboard", mode: "admin-dashboard" },
  { label: "Người dùng", mode: "admin-users" },
  { label: "Tài khoản", mode: "admin-accounts" },
  { label: "Danh mục", mode: "admin-categories" },
  { label: "Sản phẩm", mode: "admin-products" },
];

function AdminHeader({ onNavigate, onLogout }) {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="h-[60px] flex items-center justify-between px-10 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="text-xl font-black text-orange-400">ADMIN PANEL</div>
          <button
            onClick={() => onNavigate("home")}
            className="text-xs bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
          >
            ← Quay lại Store
          </button>
        </div>

        <button
          onClick={onLogout}
          className="text-sm font-bold text-red-400 hover:text-red-300"
        >
          Thoát hệ thống
        </button>
      </div>

      <div className="h-[50px] bg-slate-900 flex items-center px-10">
        <nav className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          {ADMIN_NAV_STRATEGY.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.mode)}
              className="hover:text-sky-400 transition-colors bg-transparent border-none cursor-pointer font-bold text-slate-300"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
export default AdminHeader;
