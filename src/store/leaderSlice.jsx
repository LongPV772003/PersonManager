import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:3001/users');
      const foundUser = res.data.find(
        (u) => u.username === username && u.password === password
      );
      if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser));
        return foundUser;
      } else {
        return rejectWithValue('Sai tên đăng nhập hoặc mật khẩu');
      }
    } catch (err) {
      return rejectWithValue('Lỗi kết nối đến server');
    }
  }
);


export const fetchUsers = createAsyncThunk(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:3001/users');
      return res.data;
    } catch (err) {
      return rejectWithValue('Không thể tải danh sách người dùng');
    }
  }
);

export const fetchLeaders = createAsyncThunk(
  'user/fetchLeaders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:3001/users');
      return res.data.filter(user => user.role === 'leader');
    } catch (err) {
      return rejectWithValue('Không thể tải danh sách lãnh đạo');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    users: [],
    leaders: [],
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH USERS
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // FETCH LEADERS
      .addCase(fetchLeaders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaders.fulfilled, (state, action) => {
        state.leaders = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;