import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        
        {/* Cột 1 */}
        <div>
          <h2 className="text-xl font-bold mb-3">Convenience Store</h2>
          <p className="text-gray-400">
            Hệ thống bán hàng tiện lợi - đồ án môn học MTKPM.
          </p>
        </div>

        {/* Cột 2 */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Liên kết</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Trang chủ</li>
            <li className="hover:text-white cursor-pointer">Sản phẩm</li>
            <li className="hover:text-white cursor-pointer">Giỏ hàng</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Liên hệ</h2>
          <p className="text-gray-400">Email: support@store.com</p>
          <p className="text-gray-400">Phone: 0123 456 789</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 border-t border-gray-700 py-4">
        © 2026 Convenience Store | Made by Trung
      </div>
    </footer>
  );
};

export default Footer;