import {
    EVENT_REGISTER_REQUEST,
    EVENT_REGISTER_SUCCESS,
    EVENT_REGISTER_FAIL,
    EVENT_REGISTER_RESET,
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
  
  export const eventRegisterReducer = (state = {}, action) => {
    switch (action.type) {
      case EVENT_REGISTER_REQUEST:
        return { loading: true }
      case EVENT_REGISTER_SUCCESS:
        return { loading: false, success: true, registration: action.payload }
      case EVENT_REGISTER_FAIL:
        return { loading: false, error: action.payload }
      case EVENT_REGISTER_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const eventCancelRegistrationReducer = (state = {}, action) => {
    switch (action.type) {
      case EVENT_CANCEL_REGISTRATION_REQUEST:
        return { loading: true }
      case EVENT_CANCEL_REGISTRATION_SUCCESS:
        return { loading: false, success: true }
      case EVENT_CANCEL_REGISTRATION_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
  export const eventRegistrationStatusReducer = (state = {}, action) => {
    switch (action.type) {
      case EVENT_REGISTRATION_STATUS_REQUEST:
        return { loading: true }
      case EVENT_REGISTRATION_STATUS_SUCCESS:
        return { loading: false, registrationStatus: action.payload }
      case EVENT_REGISTRATION_STATUS_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
  export const eventAttendeesReducer = (state = { attendees: {} }, action) => {
    switch (action.type) {
      case EVENT_ATTENDEES_REQUEST:
        return { loading: true }
      case EVENT_ATTENDEES_SUCCESS:
        return { loading: false, attendees: action.payload }
      case EVENT_ATTENDEES_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }