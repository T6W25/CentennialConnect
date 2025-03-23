import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get("/api/users/profile", config)

      return data.notifications
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        "/api/users/profile",
        {
          notifications: [
            {
              _id: notificationId,
              read: true,
            },
          ],
        },
        config,
      )

      return notificationId
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.error = null
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = state.notifications.map((notification) =>
          notification._id === action.payload ? { ...notification, read: true } : notification,
        )
        state.error = null
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = notificationSlice.actions

export default notificationSlice.reducer

