import { useEffect, useState } from "react";
import { getUdhaarNotifications } from "../../api/notificationApi";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await getUdhaarNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[#653239] mb-6">
        Udhaar Due Notifications
      </h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 italic">No pending notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((note, index) => (
            <li
              key={index}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm text-[#653239]"
            >
              {note.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}