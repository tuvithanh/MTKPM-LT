import React, { useState, useEffect } from "react";

// Thay đổi URL này cho đúng với Backend của bạn
const BASE_URL = "https://localhost:7197";
const API_PRODUCT = `${BASE_URL}/api/products`;
const API_CATEGORY = `${BASE_URL}/api/categories`;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initialForm = {
    name: "",
    price: 0,
    costPrice: 0,
    categoryId: "",
    unit: "Cái",
    stockQuantity: 0,
    imageUrl: "",
    barcode: "",
    description: "",
    isActive: true,
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCT);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi fetch sản phẩm:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_CATEGORY);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi fetch danh mục:", err);
    }
  };

  const generateBarcode = () => {
    const prefix = "893";
    const randomPart = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0");
    const base = prefix + randomPart;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return base + checkDigit;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${API_PRODUCT}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // Lưu path tương đối (/images/...) vào state
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      alert("Không thể tải ảnh lên Server. Kiểm tra CORS hoặc thư mục wwroot.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_PRODUCT}/${editingId}` : API_PRODUCT;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          costPrice: parseFloat(form.costPrice),
          stockQuantity: parseInt(form.stockQuantity),
          categoryId: parseInt(form.categoryId),
        }),
      });

      if (res.ok) {
        setForm(initialForm);
        setEditingId(null);
        fetchProducts();
        alert("Thành công!");
      }
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn muốn xóa sản phẩm này?")) {
      await fetch(`${API_PRODUCT}/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  // Hàm helper để hiển thị ảnh chuẩn
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=No+Image";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tight flex items-center gap-2">
        <span>📦</span> Hệ thống quản lý hàng hóa
      </h2>

      {/* SECTION: FORM NHẬP LIỆU */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Tên sản phẩm
              </label>
              <input
                className="w-full border-2 border-slate-100 p-2 rounded-lg mt-1 focus:border-sky-500 outline-none transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => {
                  if (!form.barcode && form.name)
                    setForm({ ...form, barcode: generateBarcode() });
                }}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Mô tả
              </label>
              <textarea
                className="w-full border-2 border-slate-100 p-2 rounded-lg mt-1 focus:border-sky-500 outline-none h-20"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Danh mục
              </label>
              <select
                className="w-full border-2 border-slate-100 p-2 rounded-lg mt-1"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                required
              >
                <option value="">Chọn loại</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Barcode
              </label>
              <div className="flex gap-1 mt-1">
                <input
                  className="w-full border-2 border-slate-100 p-2 rounded-lg bg-slate-50 font-mono text-xs"
                  value={form.barcode}
                  onChange={(e) =>
                    setForm({ ...form, barcode: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, barcode: generateBarcode() })
                  }
                  className="bg-slate-800 text-white px-3 rounded-lg text-[10px] hover:bg-black"
                >
                  GEN
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Giá bán (đ)
              </label>
              <input
                type="number"
                className="w-full border-2 border-slate-100 p-2 rounded-lg mt-1 font-bold text-orange-600"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Tồn kho
              </label>
              <input
                type="number"
                className="w-full border-2 border-slate-100 p-2 rounded-lg mt-1"
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm({ ...form, stockQuantity: e.target.value })
                }
              />
            </div>
          </div>

          {/* Upload ảnh */}
          <div className="md:col-span-4 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-200">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Hình ảnh
              </label>
              <input
                type="file"
                className="text-xs"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            {form.imageUrl && (
              <div className="relative">
                <img
                  src={getImageUrl(form.imageUrl)}
                  className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white"
                  alt="preview"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center text-[10px]">
                    ...
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="submit"
                disabled={uploading}
                className="bg-sky-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-700 disabled:bg-slate-400 transition-all text-sm uppercase"
              >
                {editingId ? "Cập nhật" : "Lưu sản phẩm"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                  className="bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm uppercase"
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* SECTION: DANH SÁCH SẢN PHẨM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative"
          >
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              <img
                src={getImageUrl(p.imageUrl)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={p.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Loi+Anh";
                }}
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-black bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm uppercase">
                  {p.unit}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-black bg-sky-100 text-sky-700 px-2 py-1 rounded uppercase tracking-widest">
                  {p.category?.name || "Chưa phân loại"}
                </span>
                <span
                  className={`text-[9px] font-black px-2 py-1 rounded uppercase ${p.stockQuantity > 5 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                >
                  Kho: {p.stockQuantity}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1 truncate">
                {p.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mb-4">
                {p.barcode}
              </p>

              <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                <p className="text-xl font-black text-orange-500">
                  {p.price?.toLocaleString()}đ
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setForm({ ...p, categoryId: p.categoryId?.toString() }); // Đảm bảo categoryId là string cho select
                      setEditingId(p.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
