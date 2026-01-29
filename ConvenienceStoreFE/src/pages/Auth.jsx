import React, { useState, useEffect } from "react"; // 1. Thêm useEffect
import axios from "axios";

const Auth = ({ initialMode, onLoginSuccess }) => {
  // 2. Nhận prop initialMode
  const [isLogin, setIsLogin] = useState(true);

  // 3. Quan trọng: Cập nhật isLogin mỗi khi initialMode thay đổi
  useEffect(() => {
    setIsLogin(initialMode === "login");
    setMessage({ type: "", content: "" }); // Xóa thông báo cũ khi chuyển form
  }, [initialMode]);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    provider: "Local",
  });
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";
    try {
      const response = await axios.post(
        `https://localhost:7197/api/auth/${endpoint}`,
        formData,
        { withCredentials: true }, // QUAN TRỌNG: Để trình duyệt nhận và gửi Cookies
      );

      if (isLogin) {
        // Lưu token vào localStorage (nếu backend vẫn trả về song song với Cookie)
        if (response.data.token)
          localStorage.setItem("token", response.data.token);

        setMessage({
          type: "success",
          content: `Chào mừng trở lại, ${response.data.username}!`,
        });

        // Đợi 1 chút để user kịp thấy thông báo thành công rồi chuyển trang
        setTimeout(() => {
          onLoginSuccess({
            username: response.data.username,
            role: response.data.role,
          });
        }, 1000);
      } else {
        setMessage({
          type: "success",
          content: "Đăng ký thành công! Hãy đăng nhập.",
        });
        setIsLogin(true);
      }
    } catch (error) {
      setMessage({
        type: "error",
        content:
          error.response?.data?.message ||
          error.response?.data ||
          "Có lỗi xảy ra!",
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600 uppercase">
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin
              ? "Chào mừng bạn đến với GS25"
              : "Trở thành thành viên ngay hôm nay"}
          </p>
        </div>

        {message.content && (
          <div
            className={`p-3 rounded-lg text-sm text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message.content}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nguyễn Văn A"
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              name="username"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="username123"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ type: "", content: "" });
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 underline decoration-2 underline-offset-4"
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
