import axios from 'axios';
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

// Get user notifications
export const getNotifications = (pageNumber = 1) => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTIFICATION_LIST_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(
      `/api/notifications?pageNumber=${pageNumber}`,
      config
    );

    dispatch({
      type: NOTIFICATION_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

// Get unread notification count
export const getUnreadCount = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTIFICATION_UNREAD_COUNT_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(
      '/api/notifications/unread-count',
      config
    );

    dispatch({
      type: NOTIFICATION_UNREAD_COUNT_SUCCESS,
      payload: data.count
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_UNREAD_COUNT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

// Mark notification as read
export const markAsRead = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTIFICATION_MARK_READ_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    await axios.put(
      `/api/notifications/${id}/read`,
      {},
      config
    );

    dispatch({
      type: NOTIFICATION_MARK_READ_SUCCESS,
      payload: id
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_MARK_READ_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTIFICATION_MARK_ALL_READ_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    await axios.put(
      '/api/notifications/read-all',
      {},
      config
    );

    dispatch({
      type: NOTIFICATION_MARK_ALL_READ_SUCCESS
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_MARK_ALL_READ_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

// Delete notification
export const deleteNotification = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTIFICATION_DELETE_REQUEST
    });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    await axios.delete(
      `/api/notifications/${id}`,
      config
    );

    dispatch({
      type: NOTIFICATION_DELETE_SUCCESS,
      payload: id
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};