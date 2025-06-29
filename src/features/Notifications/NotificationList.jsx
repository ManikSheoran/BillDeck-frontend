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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Udhaar Due Notifications</h2>
      {notifications.length === 0 ? (
        <p>No pending notifications.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {notifications.map((note, index) => (
            <li key={index} className="p-2 bg-yellow-100 rounded">
              {note.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
