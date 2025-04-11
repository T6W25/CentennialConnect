import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunks for analytics
export const fetchUserStats = createAsyncThunk(
  "analytics/fetchUserStats",
  async (period = "month", { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics/users?period=${period}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchEngagementStats = createAsyncThunk(
  "analytics/fetchEngagementStats",
  async (period = "month", { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics/engagement?period=${period}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchCommunityStats = createAsyncThunk(
  "analytics/fetchCommunityStats",
  async (period = "month", { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics/communities?period=${period}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchEventStats = createAsyncThunk(
  "analytics/fetchEventStats",
  async (period = "month", { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics/events?period=${period}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchContentStats = createAsyncThunk(
  "analytics/fetchContentStats",
  async (period = "month", { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics/content?period=${period}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Initial state
const initialState = {
  userStats: {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: [],
    registrationsByDay: [],
    usersByRole: [],
    loading: false,
    error: null
  },
  engagementStats: {
    totalActions: 0,
    actionsPerDay: [],
    actionsPerUser: 0,
    popularHours: [],
    retentionRate: 0,
    loading: false,
    error: null
  },
  communityStats: {
    totalCommunities: 0,
    activeCommunities: 0,
    communitiesBySize: [],
    communitiesByActivity: [],
    newCommunities: [],
    loading: false,
    error: null
  },
  eventStats: {
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    eventsByAttendance: [],
    eventsByType: [],
    loading: false,
    error: null
  },
  contentStats: {
    totalPosts: 0,
    postsPerDay: [],
    popularTags: [],
    contentByType: [],
    loading: false, 
    error: null
  }
}

// Create slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsErrors: (state) => {
      state.userStats.error = null
      state.engagementStats.error = null
      state.communityStats.error = null
      state.eventStats.error = null
      state.contentStats.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // User stats
      .addCase(fetchUserStats.pending, (state) => {
        state.userStats.loading = true
        state.userStats.error = null
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStats.loading = false
        state.userStats = {
          ...state.userStats,
          ...action.payload,
          loading: false,
          error: null
        }
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.userStats.loading = false
        state.userStats.error = action.payload?.message || "Failed to fetch user statistics"
      })
      
      // Engagement stats
      .addCase(fetchEngagementStats.pending, (state) => {
        state.engagementStats.loading = true
        state.engagementStats.error = null
      })
      .addCase(fetchEngagementStats.fulfilled, (state, action) => {
        state.engagementStats.loading = false
        state.engagementStats = {
          ...state.engagementStats,
          ...action.payload,
          loading: false,
          error: null
        }
      })
      .addCase(fetchEngagementStats.rejected, (state, action) => {
        state.engagementStats.loading = false
        state.engagementStats.error = action.payload?.message || "Failed to fetch engagement statistics"
      })
      
      // Community stats
      .addCase(fetchCommunityStats.pending, (state) => {
        state.communityStats.loading = true
        state.communityStats.error = null
      })
      .addCase(fetchCommunityStats.fulfilled, (state, action) => {
        state.communityStats.loading = false
        state.communityStats = {
          ...state.communityStats,
          ...action.payload,
          loading: false,
          error: null
        }
      })
      .addCase(fetchCommunityStats.rejected, (state, action) => {
        state.communityStats.loading = false
        state.communityStats.error = action.payload?.message || "Failed to fetch community statistics"
      })
      
      // Event stats
      .addCase(fetchEventStats.pending, (state) => {
        state.eventStats.loading = true
        state.eventStats.error = null
      })
      .addCase(fetchEventStats.fulfilled, (state, action) => {
        state.eventStats.loading = false
        state.eventStats = {
          ...state.eventStats,
          ...action.payload,
          loading: false,
          error: null
        }
      })
      .addCase(fetchEventStats.rejected, (state, action) => {
        state.eventStats.loading = false
        state.eventStats.error = action.payload?.message || "Failed to fetch event statistics"
      })
      
      // Content stats
      .addCase(fetchContentStats.pending, (state) => {
        state.contentStats.loading = true
        state.contentStats.error = null
      })
      .addCase(fetchContentStats.fulfilled, (state, action) => {
        state.contentStats.loading = false
        state.contentStats = {
          ...state.contentStats,
          ...action.payload,
          loading: false,
          error: null
        }
      })
      .addCase(fetchContentStats.rejected, (state, action) => {
        state.contentStats.loading = false
        state.contentStats.error = action.payload?.message || "Failed to fetch content statistics"
      })
  },
})

export const { clearAnalyticsErrors } = analyticsSlice.actions
export default analyticsSlice.reducer