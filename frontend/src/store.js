import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import searchReducer from "./slices/searchSlice"
import notificationReducer from "./slices/notificationSlice"
import {
  notificationListReducer,
  notificationUnreadCountReducer
} from './reducers/notificationReducers';
import {
  eventRegisterReducer,
  eventCancelRegistrationReducer,
  eventRegistrationStatusReducer,
  eventAttendeesReducer
} from './reducers/eventReducers';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
        search: searchReducer,
    notifications: notificationReducer,
    // Event registration reducers
    eventRegister: eventRegisterReducer,
    eventCancelRegistration: eventCancelRegistrationReducer,
    eventRegistrationStatus: eventRegistrationStatusReducer,
    eventAttendees: eventAttendeesReducer,
    // Notification reducers from previous implementation
    notificationList: notificationListReducer,
    notificationUnreadCount: notificationUnreadCountReducer
  },
})

export default store