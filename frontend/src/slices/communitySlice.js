import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getCommunities = createAsyncThunk(
  "communities/getCommunities",
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

      const { data } = await axios.get("/api/communities", config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const getCommunityById = createAsyncThunk(
  "communities/getCommunityById",
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

      const { data } = await axios.get(`/api/communities/${id}`, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const createCommunity = createAsyncThunk(
  "communities/createCommunity",
  async (communityData, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post("/api/communities", communityData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const createCommunityPost = createAsyncThunk(
  "communities/createCommunityPost",
  async ({ id, postData }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/communities/${id}/posts`, postData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const createCommunityGroup = createAsyncThunk(
  "communities/createCommunityGroup",
  async ({ id, groupData }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/communities/${id}/groups`, groupData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  communities: [],
  community: null,
  loading: false,
  error: null,
  success: false,
}

const communitySlice = createSlice({
  name: "communities",
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
      .addCase(getCommunities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommunities.fulfilled, (state, action) => {
        state.loading = false
        state.communities = action.payload
        state.error = null
      })
      .addCase(getCommunities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getCommunityById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommunityById.fulfilled, (state, action) => {
        state.loading = false
        state.community = action.payload
        state.error = null
      })
      .addCase(getCommunityById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCommunity.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false
        state.communities.push(action.payload)
        state.success = true
        state.error = null
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(createCommunityPost.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createCommunityPost.fulfilled, (state, action) => {
        state.loading = false
        if (state.community) {
          state.community.posts.push(action.payload)
        }
        state.success = true
        state.error = null
      })
      .addCase(createCommunityPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(createCommunityGroup.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createCommunityGroup.fulfilled, (state, action) => {
        state.loading = false
        if (state.community) {
          state.community.groups.push(action.payload)
        }
        state.success = true
        state.error = null
      })
      .addCase(createCommunityGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = communitySlice.actions

export default communitySlice.reducer

