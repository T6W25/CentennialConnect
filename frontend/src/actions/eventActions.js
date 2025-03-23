import axios from 'axios'
import {
  EVENT_REGISTER_REQUEST,
  EVENT_REGISTER_SUCCESS,
  EVENT_REGISTER_FAIL,
  EVENT_CANCEL_REGISTRATION_REQUEST,
  EVENT_CANCEL_REGISTRATION_SUCCESS,
  EVENT_CANCEL_REGISTRATION_FAIL,
  EVENT_REGISTRATION_STATUS_REQUEST,
  EVENT_REGISTRATION_STATUS_SUCCESS,
  EVENT_REGISTRATION_STATUS_FAIL,
  EVENT_ATTENDEES_REQUEST,
  EVENT_ATTENDEES_SUCCESS,
  EVENT_ATTENDEES_FAIL
} from '../constants/eventConstants'

// Register for an event
export const registerForEvent = (eventId, responses = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: EVENT_REGISTER_REQUEST })

    const { auth: { userInfo } } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.post(
      `/api/events/${eventId}/register`,
      { responses },
      config
    )

    dispatch({
      type: EVENT_REGISTER_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: EVENT_REGISTER_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    })
  }
}

// Cancel event registration
export const cancelRegistration = (eventId) => async (dispatch, getState) => {
  try {
    dispatch({ type: EVENT_CANCEL_REGISTRATION_REQUEST })

    const { auth: { userInfo } } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.delete(
      `/api/events/${eventId}/register`,
      config
    )

    dispatch({
      type: EVENT_CANCEL_REGISTRATION_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: EVENT_CANCEL_REGISTRATION_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    })
  }
}

// Get registration status
export const getRegistrationStatus = (eventId) => async (dispatch, getState) => {
  try {
    dispatch({ type: EVENT_REGISTRATION_STATUS_REQUEST })

    const { auth: { userInfo } } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(
      `/api/events/${eventId}/registration`,
      config
    )

    dispatch({
      type: EVENT_REGISTRATION_STATUS_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: EVENT_REGISTRATION_STATUS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    })
  }
}

// Get event attendees (for organizers/admins)
export const getEventAttendees = (eventId) => async (dispatch, getState) => {
  try {
    dispatch({ type: EVENT_ATTENDEES_REQUEST })

    const { auth: { userInfo } } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(
      `/api/events/${eventId}/attendees`,
      config
    )

    dispatch({
      type: EVENT_ATTENDEES_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: EVENT_ATTENDEES_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    })
  }
}