import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getFeaturedEvents = createAsyncThunk(
  "events/getFeaturedEvents",
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

      const { data } = await axios.get("/api/events/featured", config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const getAllEvents = createAsyncThunk("events/getAllEvents", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/events", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const getEventById = createAsyncThunk("events/getEventById", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/events/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { getState, rejectWithValue }) => {
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

    const { data } = await axios.post("/api/events", eventData, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/events/${id}`, eventData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const registerForEvent = createAsyncThunk(
  "events/registerForEvent",
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/events/${id}/register`, {}, config)

      return { id, data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const sendEventAnnouncement = createAsyncThunk(
  "events/sendEventAnnouncement",
  async ({ id, message }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/events/${id}/announcements`, { message }, config)

      return { id, data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  featuredEvents: [],
  events: [],
  event: null,
  loading: false,
  error: null,
  success: false,
}

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeaturedEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFeaturedEvents.fulfilled, (state, action) => {
        state.loading = false
        state.featuredEvents = action.payload
        state.error = null
      })
      .addCase(getFeaturedEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.error = null
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false
        state.event = action.payload
        state.error = null
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
        state.success = true
        state.error = null
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.map((event) => (event._id === action.payload._id ? action.payload : event))
        state.event = action.payload
        state.success = true
        state.error = null
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(registerForEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(sendEventAnnouncement.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(sendEventAnnouncement.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(sendEventAnnouncement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = eventSlice.actions

export default eventSlice.reducer

