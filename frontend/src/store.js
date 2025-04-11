import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import communityReducer from "./slices/communitySlice"
import postReducer from "./slices/postSlice"
import searchReducer from "./slices/searchSlice"
import notificationReducer from "./slices/notificationSlice"
import reportReducer from "./slices/reportSlice"
import adminReducer from "./slices/adminSlice"
import announcementReducer from "./slices/announcementSlice"
import analyticsReducer from "./slices/analyticsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    communities: communityReducer,
    posts: postReducer,
    search: searchReducer,
    notifications: notificationReducer,
    reports: reportReducer,
    admin: adminReducer,
    announcements: announcementReducer,
    analytics: analyticsReducer,
  },
})

export default store