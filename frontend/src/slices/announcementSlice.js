import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunks for announcements
export const fetchEventAnnouncements = createAsyncThunk(
  "announcements/fetchEventAnnouncements",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/events/${eventId}/announcements`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createAnnouncement = createAsyncThunk(
  "announcements/createAnnouncement",
  async ({ eventId, announcement }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/events/${eventId}/announcements`, announcement)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateAnnouncement = createAsyncThunk(
  "announcements/updateAnnouncement",
  async ({ eventId, announcementId, announcement }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/events/${eventId}/announcements/${announcementId}`,
        announcement
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteAnnouncement = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async ({ eventId, announcementId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/events/${eventId}/announcements/${announcementId}`)
      return { announcementId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sendReminder = createAsyncThunk(
  "announcements/sendReminder",
  async ({ eventId, reminderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/events/${eventId}/reminders/${reminderId}/send`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createSurvey = createAsyncThunk(
  "announcements/createSurvey",
  async ({ eventId, survey }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/events/${eventId}/surveys`, survey)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchEventSurveys = createAsyncThunk(
  "announcements/fetchEventSurveys",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/events/${eventId}/surveys`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteSurvey = createAsyncThunk(
  "announcements/deleteSurvey",
  async ({ eventId, surveyId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/events/${eventId}/surveys/${surveyId}`)
      return { surveyId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Initial state
const initialState = {
  announcements: [],
  reminders: [],
  surveys: [],
  loading: false,
  error: null,
  successMessage: null,
}

// Create slice
const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    clearAnnouncementMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchEventAnnouncements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventAnnouncements.fulfilled, (state, action) => {
        state.loading = false
        state.announcements = action.payload.announcements
        state.reminders = action.payload.reminders || []
      })
      .addCase(fetchEventAnnouncements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch announcements"
      })
      
      // Create announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.type === "ANNOUNCEMENT") {
          state.announcements.push(action.payload)
        } else if (action.payload.type === "REMINDER") {
          state.reminders.push(action.payload)
        }
        state.successMessage = "Announcement created successfully"
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to create announcement"
      })
      
      // Update announcement
      .addCase(updateAnnouncement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.type === "ANNOUNCEMENT") {
          state.announcements = state.announcements.map(a => 
            a._id === action.payload._id ? action.payload : a
          )
        } else if (action.payload.type === "REMINDER") {
          state.reminders = state.reminders.map(r => 
            r._id === action.payload._id ? action.payload : r
          )
        }
        state.successMessage = "Announcement updated successfully"
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to update announcement"
      })
      
      // Delete announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false
        state.announcements = state.announcements.filter(
          a => a._id !== action.payload.announcementId
        )
        state.reminders = state.reminders.filter(
          r => r._id !== action.payload.announcementId
        )
        state.successMessage = "Announcement deleted successfully"
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to delete announcement"
      })
      
      // Send reminder
      .addCase(sendReminder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendReminder.fulfilled, (state, action) => {
        state.loading = false
        state.reminders = state.reminders.map(r => 
          r._id === action.payload._id ? { ...r, sentAt: action.payload.sentAt } : r
        )
        state.successMessage = "Reminder sent successfully"
      })
      .addCase(sendReminder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to send reminder"
      })
      
      // Surveys
      .addCase(createSurvey.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.loading = false
        state.surveys.push(action.payload)
        state.successMessage = "Survey created successfully"
      })
      .addCase(createSurvey.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to create survey"
      })
      
      // Fetch surveys
      .addCase(fetchEventSurveys.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventSurveys.fulfilled, (state, action) => {
        state.loading = false
        state.surveys = action.payload
      })
      .addCase(fetchEventSurveys.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch surveys"
      })
      
      // Delete survey
      .addCase(deleteSurvey.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.loading = false
        state.surveys = state.surveys.filter(s => s._id !== action.payload.surveyId)
        state.successMessage = "Survey deleted successfully"
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to delete survey"
      })
  },
})

export const { clearAnnouncementMessages } = announcementSlice.actions
export default announcementSlice.reducer
