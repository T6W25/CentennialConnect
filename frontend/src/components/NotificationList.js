"use client"
import { useEffect, useState } from "react"
import '../styles/NotificationList.css'
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../slices/notificationSlice"
import { formatDistanceToNow } from "../utils/formatDate"

const NotificationList = ({ notifications, loading, error }) => {
  const dispatch = useDispatch()
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    // Check if there are any unread notifications
    setHasUnread(notifications.some(notif => !notif.read))
  }, [notifications])

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id))
    }
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  const handleDeleteNotification = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this notification?')) {
      dispatch(deleteNotification(id))
    }
  }

  // Generate notification content based on type
  const getNotificationContent = (notification) => {
    const { type } = notification
    
    switch (type) {
      case 'newFollower':
        return `${notification.sender?.name || 'Someone'} started following you`
      case 'postLike':
        return `${notification.sender?.name || 'Someone'} liked your post`
      case 'postComment':
        return `${notification.sender?.name || 'Someone'} commented on your post`
      case 'eventInvite':
        return `${notification.sender?.name || 'Someone'} invited you to an event`
      case 'communityInvite':
        return `${notification.sender?.name || 'Someone'} invited you to join a community`
      case 'adminAlert':
      case 'system':
        return notification.message
      default:
        return notification.message
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading notifications...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        <div className="text-4xl mb-2">📭</div>
        <p>No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="notification-list-container">
      {hasUnread && (
        <div className="flex justify-end px-4 py-2 border-b">
          <button 
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        </div>
      )}
      
      <div className="space-y-3 max-h-96 overflow-y-auto p-3">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            className={`p-3 rounded-md relative group ${notification.read ? "bg-gray-50" : "bg-green-50"}`}
          >
            <Link 
              to={notification.link || "#"} 
              className="block" 
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                {notification.sender?.profileImage && (
                  <img 
                    src={notification.sender.profileImage} 
                    alt={notification.sender.name}
                    className="w-8 h-8 rounded-full mr-3 mt-1"
                  />
                )}
                <div className="flex-1">
                  <p className="text-gray-800 text-sm mb-1">
                    {getNotificationContent(notification)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(notification.createdAt || notification.date)}
                  </p>
                </div>
              </div>
            </Link>
            
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDeleteNotification(e, notification._id)}
              aria-label="Delete notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationList