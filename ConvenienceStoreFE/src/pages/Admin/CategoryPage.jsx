import React, { useState, useEffect } from "react";

const CATEGORY_API = "https://localhost:7197/api/categories"; // Kiểm tra lại port API của bạn nhé

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(CATEGORY_API);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Tên danh mục không được để trống!");

    const categoryData = { name };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${CATEGORY_API}/${editingId}` : CATEGORY_API;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (res.ok) {
        setName("");
        setEditingId(null);
        fetchCategories(); // Reload danh sách
      }
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu");
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await fetch(`${CATEGORY_API}/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      alert("Lỗi khi xóa");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-slate-800 mb-6">
        QUẢN LÝ DANH MỤC
      </h2>

      {/* Form Thêm/Sửa */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Nhập tên danh mục mới..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
              editingId
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium"
            >
              Hủy
            </button>
          )}
        </form>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">ID</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">
                Tên danh mục
              </th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="3" className="p-10 text-center text-slate-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-500">
                    #{cat.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-amber-600 hover:bg-amber-50 px-3 py-1 rounded transition-colors text-sm font-bold"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors text-sm font-bold"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
