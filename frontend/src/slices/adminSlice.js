import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunks for admin settings
export const fetchSystemSettings = createAsyncThunk(
  "admin/fetchSystemSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/settings")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateSystemSettings = createAsyncThunk(
  "admin/updateSystemSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/admin/settings", settings)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchContentRules = createAsyncThunk(
  "admin/fetchContentRules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/content-rules")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateContentRules = createAsyncThunk(
  "admin/updateContentRules",
  async (rules, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/admin/content-rules", rules)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchUserRoles = createAsyncThunk(
  "admin/fetchUserRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/user-roles")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}/role`, { role })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchPlugins = createAsyncThunk(
  "admin/fetchPlugins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/plugins")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const togglePlugin = createAsyncThunk(
  "admin/togglePlugin",
  async ({ pluginId, enabled }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/plugins/${pluginId}`, { enabled })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Initial state
const initialState = {
  systemSettings: {
    platformName: "",
    logoUrl: "",
    primaryColor: "#3f51b5",
    secondaryColor: "#f50057",
    contactEmail: "",
    maxUploadSize: 5,
    allowUserRegistration: true,
    requireEmailVerification: true,
    autoApproveContent: false
  },
  contentRules: {
    allowedMediaTypes: [],
    prohibitedKeywords: [],
    contentReviewEnabled: true,
    autoApproveUsers: [],
    flagThreshold: 3
  },
  userRoles: [],
  plugins: [],
  loading: false,
  error: null,
  successMessage: null
}

// Create slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch system settings
      .addCase(fetchSystemSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.loading = false
        state.systemSettings = action.payload
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch system settings"
      })
      
      // Update system settings
      .addCase(updateSystemSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.loading = false
        state.systemSettings = action.payload
        state.successMessage = "System settings updated successfully"
      })
      .addCase(updateSystemSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to update system settings"
      })
      
      // Fetch content rules
      .addCase(fetchContentRules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContentRules.fulfilled, (state, action) => {
        state.loading = false
        state.contentRules = action.payload
      })
      .addCase(fetchContentRules.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch content rules"
      })
      
      // Update content rules
      .addCase(updateContentRules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContentRules.fulfilled, (state, action) => {
        state.loading = false
        state.contentRules = action.payload
        state.successMessage = "Content rules updated successfully"
      })
      .addCase(updateContentRules.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to update content rules"
      })
      
      // Fetch user roles
      .addCase(fetchUserRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.loading = false
        state.userRoles = action.payload
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch user roles"
      })
      
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false
        state.userRoles = state.userRoles.map(user => 
          user._id === action.payload._id ? action.payload : user
        )
        state.successMessage = "User role updated successfully"
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to update user role"
      })
      
      // Fetch plugins
      .addCase(fetchPlugins.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlugins.fulfilled, (state, action) => {
        state.loading = false
        state.plugins = action.payload
      })
      .addCase(fetchPlugins.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch plugins"
      })
      
      // Toggle plugin
      .addCase(togglePlugin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(togglePlugin.fulfilled, (state, action) => {
        state.loading = false
        state.plugins = state.plugins.map(plugin => 
          plugin._id === action.payload._id ? action.payload : plugin
        )
        state.successMessage = `Plugin ${action.payload.enabled ? 'enabled' : 'disabled'} successfully`
      })
      .addCase(togglePlugin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to toggle plugin"
      })
  },
})

export const { clearAdminMessages } = adminSlice.actions
export default adminSlice.reducer