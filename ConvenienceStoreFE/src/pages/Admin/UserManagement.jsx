import React, { useState, useEffect } from "react";

const API_USER = "https://localhost:7197/api/User";
const API_ACCOUNT = "https://localhost:7197/api/Account";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [userName, setUserName] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_USER);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng API create-admin-simple bạn đã viết
  const handleCreateAdmin = async () => {
    if (!userName) return alert("Nhập tên admin");
    try {
      const res = await fetch(`${API_ACCOUNT}/create-admin-simple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userName),
      });
      const result = await res.json();
      if (res.ok) {
        alert(
          `Thành công! User: ${result.data.username} - Pass: ${result.data.passwordDefault}`,
        );
        setUserName("");
        fetchUsers();
      } else {
        alert(result.message || "Lỗi");
      }
    } catch (err) {
      alert("Lỗi kết nối API");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Xóa người dùng này?")) return;
    await fetch(`${API_USER}/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-800">
          👥 QUẢN LÝ NGƯỜI DÙNG
        </h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded text-sm"
            placeholder="Tên Admin mới..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            onClick={handleCreateAdmin}
            className="bg-orange-500 text-white px-4 py-2 rounded font-bold text-sm"
          >
            + Tạo nhanh Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4">Họ tên</th>
              <th className="p-4">Username (Account)</th>
              <th className="p-4">Quyền</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 text-blue-600">
                  {u.account?.username || "Chưa có"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${u.account?.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100"}`}
                  >
                    {u.account?.role || "N/A"}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-500 hover:underline font-bold text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
