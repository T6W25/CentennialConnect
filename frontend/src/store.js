import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import communityReducer from "./slices/communitySlice"
import postReducer from "./slices/postSlice"
import searchReducer from "./slices/searchSlice"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from "./slices/notificationSlice"
import {
  notificationListReducer,
  notificationUnreadCountReducer
} from './reducers/notificationReducers';

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

