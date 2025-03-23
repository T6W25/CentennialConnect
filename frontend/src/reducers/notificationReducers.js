import {
    NOTIFICATION_LIST_REQUEST,
    NOTIFICATION_LIST_SUCCESS,
    NOTIFICATION_LIST_FAIL,
    NOTIFICATION_UNREAD_COUNT_REQUEST,
    NOTIFICATION_UNREAD_COUNT_SUCCESS,
    NOTIFICATION_UNREAD_COUNT_FAIL,
    NOTIFICATION_MARK_READ_REQUEST,
    NOTIFICATION_MARK_READ_SUCCESS,
    NOTIFICATION_MARK_READ_FAIL,
    NOTIFICATION_MARK_ALL_READ_REQUEST,
    NOTIFICATION_MARK_ALL_READ_SUCCESS,
    NOTIFICATION_MARK_ALL_READ_FAIL,
    NOTIFICATION_DELETE_REQUEST,
    NOTIFICATION_DELETE_SUCCESS,
    NOTIFICATION_DELETE_FAIL
  } from '../constants/notificationConstants';
  
  // Reducer for notification list
  export const notificationListReducer = (
    state = { notifications: [], loading: true },
    action
  ) => {
    switch (action.type) {
      case NOTIFICATION_LIST_REQUEST:
        return {
          ...state,
          loading: true
        };
      case NOTIFICATION_LIST_SUCCESS:
        return {
          loading: false,
          notifications: action.payload.page === 1 
            ? action.payload.notifications 
            : [...state.notifications, ...action.payload.notifications],
          pages: action.payload.pages,
          page: action.payload.page,
          unreadCount: action.payload.unreadCount
        };
      case NOTIFICATION_LIST_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case NOTIFICATION_MARK_READ_SUCCESS:
        return {
          ...state,
          notifications: state.notifications.map(notification =>
            notification._id === action.payload
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0
        };
      case NOTIFICATION_MARK_ALL_READ_SUCCESS:
        return {
          ...state,
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true
          })),
          unreadCount: 0
        };
      case NOTIFICATION_DELETE_SUCCESS:
        return {
          ...state,
          notifications: state.notifications.filter(
            notification => notification._id !== action.payload
          )
        };
      default:
        return state;
    }
  };
  
  // Reducer for notification unread count
  export const notificationUnreadCountReducer = (
    state = { count: 0 },
    action
  ) => {
    switch (action.type) {
      case NOTIFICATION_UNREAD_COUNT_REQUEST:
        return {
          loading: true
        };
      case NOTIFICATION_UNREAD_COUNT_SUCCESS:
        return {
          loading: false,
          count: action.payload
        };
      case NOTIFICATION_UNREAD_COUNT_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };