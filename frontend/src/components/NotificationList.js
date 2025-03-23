"use client"
import '../styles/NotificationList.css';
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { markNotificationAsRead } from "../slices/notificationSlice"
import { formatDistanceToNow } from "../utils/formatDate"

const NotificationList = ({ notifications }) => {
  const dispatch = useDispatch()

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id))
    }
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div key={notification._id} className={`p-3 rounded-md ${notification.read ? "bg-gray-50" : "bg-green-50"}`}>
          <Link to={notification.link || "#"} className="block" onClick={() => handleNotificationClick(notification)}>
            <p className="text-gray-800 text-sm mb-1">{notification.message}</p>
            <p className="text-xs text-gray-500">{formatDistanceToNow(notification.date)}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default NotificationList

