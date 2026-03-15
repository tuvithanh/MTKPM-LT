import { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5022/api/notification")
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="fixed top-20 right-5 bg-white shadow-lg rounded-lg w-72 p-4 border">
      <h3 className="font-bold mb-2">Thông báo</h3>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Không có thông báo</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} className="border-b py-2 text-sm">
            {n}
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;