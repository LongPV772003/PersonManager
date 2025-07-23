import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLeaders = createAsyncThunk(
  'leader/fetchAll',
  async () => {
    const res = await axios.get('http://localhost:3001/users');
    return res.data.filter(user => user.role === 'leader');
  }
);

const leaderSlice = createSlice({
  name: 'leader',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaders.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch leaders';
      });
  }
});

export default leaderSlice.reducer;