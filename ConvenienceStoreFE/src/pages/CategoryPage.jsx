import { useEffect, useState } from "react";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5022/api/categories";

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId == null) {
      // ADD
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
    } else {
      // UPDATE
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name })
      });
      setEditingId(null);
    }

    setName("");
    loadCategories();
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Quản lý Category</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          className="border p-2 w-64"
          placeholder="Tên category..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => handleEdit(c)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(c.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
