import { useEffect, useState } from "react";
import { getUdhaarNotifications } from "../../api/notificationApi";
import { BellIcon } from "lucide-react"; 

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
      <h2 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
        <BellIcon className="w-6 h-6 text-emerald-600" />
        Udhaar Due Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-emerald-50 border border-dashed border-emerald-200 rounded-xl p-6 text-emerald-500 text-sm shadow-sm">
          <BellIcon className="w-8 h-8 mb-2 text-emerald-300" />
          No pending notifications.
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg shadow-sm text-emerald-900"
            >
              <BellIcon className="w-5 h-5 mt-1 flex-shrink-0 text-emerald-600" />
              <p className="text-sm leading-relaxed">{note.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
