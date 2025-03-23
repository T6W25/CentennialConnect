import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getFeaturedPosts = createAsyncThunk("posts/getFeaturedPosts", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/posts/featured", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const getPostById = createAsyncThunk("posts/getPostById", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/posts/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const upvotePost = createAsyncThunk("posts/upvotePost", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/posts/${id}/upvote`, {}, config)

    return { id, upvotes: data.upvotes }
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const commentOnPost = createAsyncThunk(
  "posts/commentOnPost",
  async ({ id, text }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/posts/${id}/comments`, { text }, config)

      return { id, comments: data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  featuredPosts: [],
  post: null,
  loading: false,
  error: null,
  success: false,
}

const postSlice = createSlice({
  name: "posts",
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
      .addCase(getFeaturedPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFeaturedPosts.fulfilled, (state, action) => {
        state.loading = false
        state.featuredPosts = action.payload
        state.error = null
      })
      .addCase(getFeaturedPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false
        state.post = action.payload
        state.error = null
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(upvotePost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        state.loading = false
        if (state.post && state.post._id === action.payload.id) {
          state.post.upvotes = action.payload.upvotes
        }
        state.featuredPosts = state.featuredPosts.map((post) =>
          post._id === action.payload.id ? { ...post, upvotes: action.payload.upvotes } : post,
        )
        state.error = null
      })
      .addCase(upvotePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(commentOnPost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(commentOnPost.fulfilled, (state, action) => {
        state.loading = false
        if (state.post && state.post._id === action.payload.id) {
          state.post.comments = action.payload.comments
        }
        state.error = null
      })
      .addCase(commentOnPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, resetSuccess } = postSlice.actions

export default postSlice.reducer

