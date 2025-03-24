import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, markNotificationAsRead, clearError } from "../slices/notificationSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatDistanceToNow } from "../utils/formatDate";
import "../styles/NotificationsPage.css";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 border border-gray-300 mt-4">
        <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Notifications</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Message>
        ) : notifications && notifications.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 ${notification.read ? "bg-white" : "bg-green-50"}`}
                >
                  <Link
                    to={notification.link || "#"}
                    className="block"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className="text-gray-800 mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(notification.date)}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-semibold mb-2">No notifications</h2>
            <p className="text-gray-600">You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
