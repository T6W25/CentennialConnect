import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import communityReducer from "./slices/communitySlice"
import postReducer from "./slices/postSlice"
import searchReducer from "./slices/searchSlice"
import notificationReducer from "./slices/notificationSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    communities: communityReducer,
    posts: postReducer,
    search: searchReducer,
    notifications: notificationReducer,
  },
})

export default store

