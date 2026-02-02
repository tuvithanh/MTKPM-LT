import React, { useState, useEffect } from "react";

const BASE_URL = "https://localhost:7197";
const API_PRODUCT = `${BASE_URL}/api/products`;
const API_CATEGORY = `${BASE_URL}/api/categories`;

export default function UserProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  // State cho Tìm kiếm và Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCT);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data.filter((p) => p.isActive) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_CATEGORY);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=No+Image";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`;
  };

  const addToCart = (product) => {
    // 1. Luôn lấy dữ liệu mới nhất từ localStorage để tránh bị ghi đè dữ liệu cũ
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    let newCart = [...currentCart];

    const index = newCart.findIndex((item) => item.id === product.id);

    if (index >= 0) {
      newCart[index].quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }

    // 2. Cập nhật state nội bộ (nếu cần dùng hiển thị tại trang này)
    setCart(newCart);

    // 3. Lưu vào localStorage
    localStorage.setItem("cart", JSON.stringify(newCart));

    // 4. PHÁT TÍN HIỆU CHO HEADER (Để icon giỏ hàng cập nhật số lượng ngay lập tức)
    window.dispatchEvent(new Event("storage"));

    // 5. Thông báo nhẹ cho người dùng (Thoải mái hơn dùng alert)
    // Bạn có thể dùng toast message hoặc đơn giản là đổi màu nút trong 1 giây
    console.log("Đã thêm vào giỏ:", product.name);
  };

  // Logic lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      p.categoryId?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-10">
      {/* THANH TÌM KIẾM & DANH MỤC */}
      <div className="bg-white shadow-sm sticky top-0 z-10 mb-6">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Bộ lọc danh mục (Dạng Tab) */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === "all" ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              TẤT CẢ
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat.id.toString() ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sky-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Ảnh - Ô nhỏ hơn (H-40) */}
              <div className="h-40 relative overflow-hidden bg-gray-50 rounded-t-lg">
                <img
                  src={getImageUrl(p.imageUrl)}
                  alt={p.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150?text=No+Image")
                  }
                />
                {p.stockQuantity <= 0 && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-bold text-red-500 uppercase">
                    Hết hàng
                  </div>
                )}
              </div>

              {/* Nội dung */}
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-xs font-medium text-gray-700 line-clamp-2 h-8 mb-1 leading-tight">
                  {p.name}
                </h3>
                <div className="mt-auto">
                  <p className="text-sm font-black text-gray-900">
                    {p.price?.toLocaleString()}đ
                  </p>

                  {/* Nút Thêm nhanh */}
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.stockQuantity <= 0}
                    className="w-full mt-2 bg-white border border-sky-500 text-sky-600 text-[10px] font-bold py-1.5 rounded 
             hover:bg-sky-500 hover:text-white active:scale-95 transition-all duration-150
             disabled:border-gray-300 disabled:text-gray-400 disabled:active:scale-100"
                  >
                    + THÊM VÀO GIỎ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Không tìm thấy sản phẩm nào...
          </div>
        )}
      </div>
    </div>
  );
}
