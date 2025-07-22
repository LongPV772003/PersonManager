import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import leaderReducer from './leaderSlice'
import authReducer from './authSlice'

const store = configureStore({
  reducer: {
    employee: employeeReducer,
    leader: leaderReducer,
    user: authReducer
  }
});

export default store;
