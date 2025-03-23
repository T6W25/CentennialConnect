import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const searchAll = createAsyncThunk("search/searchAll", async (query, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/search?query=${query}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const searchByType = createAsyncThunk(
  "search/searchByType",
  async ({ query, type }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(`/api/search?query=${query}&type=${type}`, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  results: {},
  loading: false,
  error: null,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = {}
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
        state.error = null
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(searchByType.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchByType.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
        state.error = null
      })
      .addCase(searchByType.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearResults, clearError } = searchSlice.actions

export default searchSlice.reducer

