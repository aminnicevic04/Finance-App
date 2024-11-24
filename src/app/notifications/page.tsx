"use client";
import React, { useState } from "react";

interface Notification {
  id: number;
  message: string;
  type: "good" | "bad";
  isNew: boolean;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Ostvarili ste novi rekord dnevne prodaje!",
      type: "good",
      isNew: true,
    },
    {
      id: 2,
      message: "Prešli ste limit troškova za ovaj mesec.",
      type: "bad",
      isNew: true,
    },
    {
      id: 3,
      message: "Ostvarili ste novu rekordnu mesečnu zaradu!",
      type: "good",
      isNew: false,
    },
    {
      id: 4,
      message: "Troškovi su prešli zadati limit.",
      type: "bad",
      isNew: false,
    },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isNew: false }
          : notification
      )
    );
  };

  const newNotifications = notifications.filter(
    (notification) => notification.isNew
  );
  const readNotifications = notifications.filter(
    (notification) => !notification.isNew
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Notifikacije
        </h1>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Nove notifikacije
          </h2>
          {newNotifications.length === 0 ? (
            <p className="text-gray-700">Nema novih notifikacija.</p>
          ) : (
            <ul className="space-y-4">
              {newNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 rounded-lg shadow-md ${
                    notification.type === "good" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {notification.message}
                    </span>
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Označi kao pročitano
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Pregledane notifikacije
          </h2>
          {readNotifications.length === 0 ? (
            <p className="text-gray-700">Nema pregledanih notifikacija.</p>
          ) : (
            <ul className="space-y-4">
              {readNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 rounded-lg shadow-md ${
                    notification.type === "good" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <span className="text-gray-700">{notification.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
