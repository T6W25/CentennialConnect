import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Get all posts with optional filtering
export const getPosts = createAsyncThunk(
  "posts/getPosts", 
  async ({ page = 1, category, tag, sort, search, community, user } = {}, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState()
      
      // Build query parameters
      const params = new URLSearchParams()
      if (page) params.append('page', page)
      if (category) params.append('category', category)
      if (tag) params.append('tag', tag)
      if (sort) params.append('sort', sort)
      if (search) params.append('search', search)
      if (community) params.append('community', community)
      if (user) params.append('user', user)
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(`/api/posts?${params.toString()}`, config)

      return data
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
    }
  }
)

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

export const createPost = createAsyncThunk(
  "posts/createPost", 
  async (postData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post('/api/posts', postData, config)

      return data
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
    }
  }
)

export const updatePost = createAsyncThunk(
  "posts/updatePost", 
  async ({ id, postData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/posts/${id}`, postData, config)

      return data
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
    }
  }
)

export const deletePost = createAsyncThunk(
  "posts/deletePost", 
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`/api/posts/${id}`, config)

      return id
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
    }
  }
)

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

    return { id, upvotes: data.upvotes, upvoteCount: data.upvoteCount }
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const commentOnPost = createAsyncThunk(
  "posts/commentOnPost",
  async ({ id, content }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/posts/${id}/comments`, { content }, config)

      return { id, comment: data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const upvoteComment = createAsyncThunk(
  "posts/upvoteComment",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/posts/${postId}/comments/${commentId}/upvote`, {}, config)

      return { postId, commentId, upvotes: data.upvotes, upvoteCount: data.upvoteCount }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  posts: [],
  featuredPosts: [],
  post: null,
  loading: false,
  error: null,
  success: false,
  page: 1,
  pages: 1,
  totalCount: 0,
  creatingPost: false,
  createSuccess: false,
  createError: null,
  updatingPost: false,
  updateSuccess: false,
  updateError: null,
  deletingPost: false,
  deleteSuccess: false,
  deleteError: null,
}

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.createError = null
      state.updateError = null
      state.deleteError = null
    },
    resetSuccess: (state) => {
      state.success = false
      state.createSuccess = false
      state.updateSuccess = false
      state.deleteSuccess = false
    },
    resetPostState: (state) => {
      state.post = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Posts
      .addCase(getPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.posts
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.totalCount = action.payload.totalCount
        state.error = null
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Featured Posts
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
      // Get Post by ID
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
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.creatingPost = true
        state.createError = null
        state.createSuccess = false
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creatingPost = false
        state.posts = [action.payload, ...state.posts]
        state.createSuccess = true
        state.createError = null
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creatingPost = false
        state.createError = action.payload
        state.createSuccess = false
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.updatingPost = true
        state.updateError = null
        state.updateSuccess = false
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updatingPost = false
        state.posts = state.posts.map(post => 
          post._id === action.payload._id ? action.payload : post
        )
        if (state.post && state.post._id === action.payload._id) {
          state.post = action.payload
        }
        state.updateSuccess = true
        state.updateError = null
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updatingPost = false
        state.updateError = action.payload
        state.updateSuccess = false
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.deletingPost = true
        state.deleteError = null
        state.deleteSuccess = false
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deletingPost = false
        state.posts = state.posts.filter(post => post._id !== action.payload)
        state.deleteSuccess = true
        state.deleteError = null
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deletingPost = false
        state.deleteError = action.payload
        state.deleteSuccess = false
      })
      // Upvote Post
      .addCase(upvotePost.pending, (state) => {
        // We don't set loading=true here to prevent UI flickering during upvote
        state.error = null
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        // Update in post detail view
        if (state.post && state.post._id === action.payload.id) {
          state.post.upvotes = action.payload.upvotes;
          state.post.upvoteCount = action.payload.upvoteCount;
        }
        // Update in posts list
        state.posts = state.posts.map((post) =>
          post._id === action.payload.id ? 
            { ...post, upvotes: action.payload.upvotes, upvoteCount: action.payload.upvoteCount } : 
            post
        );
        // Update in featured posts
        state.featuredPosts = state.featuredPosts.map((post) =>
          post._id === action.payload.id ? 
            { ...post, upvotes: action.payload.upvotes, upvoteCount: action.payload.upvoteCount } : 
            post
        );
        state.error = null;
      })
      .addCase(upvotePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Comment on Post
      .addCase(commentOnPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(commentOnPost.fulfilled, (state, action) => {
        state.loading = false;
        if (state.post && state.post._id === action.payload.id) {
          state.post.comments.push(action.payload.comment);
          state.post.commentCount = (state.post.commentCount || 0) + 1;
        }
        state.error = null;
        state.success = true;
      })
      .addCase(commentOnPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upvote Comment
      .addCase(upvoteComment.pending, (state) => {
        // Don't set loading=true for upvote operations
        state.error = null;
      })
      .addCase(upvoteComment.fulfilled, (state, action) => {
        if (state.post && state.post._id === action.payload.postId) {
          state.post.comments = state.post.comments.map(comment => 
            comment._id === action.payload.commentId ? 
              { ...comment, upvotes: action.payload.upvotes, upvoteCount: action.payload.upvoteCount } : 
              comment
          );
        }
        state.error = null;
      })
      .addCase(upvoteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
})

export const { clearError, resetSuccess, resetPostState } = postSlice.actions

export default postSlice.reducer