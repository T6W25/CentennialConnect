import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunks for reports
export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/reports${communityId ? `?communityId=${communityId}` : ''}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const resolveReport = createAsyncThunk(
  "reports/resolveReport",
  async ({ reportId, resolution, actionTaken }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/reports/${reportId}/resolve`, {
        resolution,
        actionTaken
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteReportedContent = createAsyncThunk(
  "reports/deleteReportedContent",
  async ({ reportId, contentType, contentId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/${contentType}s/${contentId}`, {
        data: { reportId }
      })
      return { reportId, success: true }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Initial state
const initialState = {
  reports: [],
  loading: false,
  error: null,
  successMessage: null,
}

// Create slice
const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch reports"
      })
      .addCase(resolveReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        state.loading = false
        state.reports = state.reports.map(report => 
          report._id === action.payload._id ? action.payload : report
        )
        state.successMessage = "Report resolved successfully"
      })
      .addCase(resolveReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to resolve report"
      })
      .addCase(deleteReportedContent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteReportedContent.fulfilled, (state, action) => {
        state.loading = false
        state.reports = state.reports.map(report => 
          report._id === action.payload.reportId 
            ? { ...report, status: "RESOLVED", resolution: "CONTENT_REMOVED" }
            : report
        )
        state.successMessage = "Content was deleted and report resolved"
      })
      .addCase(deleteReportedContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to delete content"
      })
  },
})

export const { clearReportMessages } = reportSlice.actions
export default reportSlice.reducer