import React, { useEffect } from "react";

const BASE_URL = "https://localhost:7197";

export default function OrderSuccess({ onNavigate }) {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const status = params.get("status");

  useEffect(() => {
    // Xóa giỏ hàng nếu thanh toán thành công
    if (status === "00") {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));
    }
  }, [status]);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center py-20">
      <div className="max-w-md w-full mx-auto px-4">
        {status === "00" ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-black text-green-600 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-slate-600 mb-4">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được giao sớm.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">Mã đơn hàng:</p>
              <p className="text-lg font-bold text-slate-800">{orderId}</p>
            </div>
            <button
              onClick={() => {
                onNavigate("home");
              }}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-all w-full"
            >
              Quay về trang chủ
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-black text-red-600 mb-2">
              Thanh toán thất bại!
            </h1>
            <p className="text-slate-600 mb-4">
              Giao dịch không thành công. Vui lòng thử lại.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">Mã lỗi:</p>
              <p className="text-lg font-bold text-slate-800">{status}</p>
            </div>
            <button
              onClick={() => {
                onNavigate("cart");
              }}
              className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-all w-full"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
