import { useEffect, useState } from "react";

const PRODUCT_API = "http://localhost:5022/api/products";
const CATEGORY_API = "http://localhost:5022/api/categories";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await fetch(PRODUCT_API);
    const data = await res.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const res = await fetch(CATEGORY_API);
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !categoryId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const product = {
      name: name,
      price: parseFloat(price),
      categoryId: parseInt(categoryId)
    };

    console.log("Sending:", product);

    const url = editingId
      ? `${PRODUCT_API}/${editingId}`
      : PRODUCT_API;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("Lỗi API: " + msg);
      return;
    }

    setName("");
    setPrice("");
    setCategoryId("");
    setEditingId(null);
    loadProducts();
  };

  const handleEdit = (p) => {
    setName(p.name);
    setPrice(p.price);
    setCategoryId(p.categoryId.toString());
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    await fetch(`${PRODUCT_API}/${id}`, { method: "DELETE" });
    loadProducts();
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">📦 Quản lý sản phẩm</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">-- Chọn Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white rounded">
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">CategoryId</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.categoryId}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
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
