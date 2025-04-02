// slices/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all jobs with pagination and filters
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async ({ page = 1, ...filters }, { rejectWithValue }) => {
  try {
    // Build query params
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (filters.type) params.append('type', filters.type);
    if (filters.location) params.append('location', filters.location);
    if (filters.isRemote) params.append('isRemote', filters.isRemote);
    
    const { data } = await axios.get(`/api/jobs?${params.toString()}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch job details by ID
export const fetchJobDetails = createAsyncThunk('jobs/fetchJobDetails', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/jobs/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Create a new job
export const createJob = createAsyncThunk('jobs/createJob', async (jobData, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const { data } = await axios.post('/api/jobs', jobData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update a job
export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, jobData }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const { data } = await axios.put(`/api/jobs/${id}`, jobData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Delete a job
export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/jobs/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Search for jobs
export const searchJobs = createAsyncThunk('jobs/searchJobs', async (searchParams, { rejectWithValue }) => {
  try {
    // Build query params
    const params = new URLSearchParams();
    
    if (searchParams.query) params.append('query', searchParams.query);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.remote) params.append('remote', searchParams.remote);
    if (searchParams.page) params.append('page', searchParams.page);
    
    const { data } = await axios.get(`/api/jobs/search?${params.toString()}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch jobs posted by current user
export const fetchMyJobs = createAsyncThunk('jobs/fetchMyJobs', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/jobs/myjobs');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  jobs: [],
  job: null,
  loading: false,
  error: null,
  success: false,
  page: 1,
  pages: 1,
  totalJobs: 0,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    resetJobState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearJobDetails: (state) => {
      state.job = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalJobs = action.payload.totalJobs;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch job details
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.job = action.payload;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.job = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        state.job = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search jobs
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalJobs = action.payload.totalJobs;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch my jobs
      .addCase(fetchMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetJobState, clearJobDetails } = jobSlice.actions;

export default jobSlice.reducer;