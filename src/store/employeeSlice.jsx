import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEmployees = createAsyncThunk(
  'employee/fetch',
  async (user) => {
    const res = await axios.get('http://localhost:3001/employees');
    return user.role === 'leader'
      ? res.data
      : res.data.filter(emp => emp.createdBy === user.id);
  }
);

export const updateEmployeeProfile = createAsyncThunk(
  'employee/updateProfile',
  async ({ id, profile, application }) => {
    const current = await axios.get(`http://localhost:3001/employees/${id}`);
    const payload = {
      ...current.data,
      profileRecords: profile,
      applicationRecords: application,
    };
    await axios.put(`http://localhost:3001/employees/${id}`, payload);
    return payload;
  }
);

export const createEmployee = createAsyncThunk(
  'employee/create',
  async (employee, thunkAPI) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.post('http://localhost:3001/employees', {
      ...employee,
      createdBy: user.id
    });
    return res.data;
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/update',
  async (employee, thunkAPI) => {
    await axios.put(`http://localhost:3001/employees/${employee.id}`, employee);
    return employee;
  }
);
export const updateEmployeeWithLeaderSubmission = createAsyncThunk(
  'employee/updateWithLeader',
  async ({ employeeData, profile, application, leaderSubmission }, thunkAPI) => {
    const payload = {
      ...employeeData,
      profileRecords: profile,
      applicationRecords: application,
      leaderSubmission: leaderSubmission,
      status: 'Chờ xử lý'
    };
    await axios.put(`http://localhost:3001/employees/${employeeData.id}`, payload);
    return payload;
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    list: [],
    loading: false,
    openDialog: false,
    editData: null,
    viewData: null,
    registerDialogOpen: false,
    currentEmployeeId: null,
    registerData: {
      profile: {},
      application: {},
    },
  },
  reducers: {
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },
    setEditData: (state, action) => {
      state.editData = action.payload;
    },
    setViewData: (state, action) => {
      state.viewData = action.payload;
    },
    setRegisterDialogOpen: (state, action) => {
      state.registerDialogOpen = action.payload;
    },
    setCurrentEmployeeId: (state, action) => {
      state.currentEmployeeId = action.payload;
    },
    setRegisterData: (state, action) => {
      state.registerData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  }
});

export const {
  setOpenDialog, setEditData, setViewData,
  setRegisterDialogOpen, setRegisterData,
  setCurrentEmployeeId
} = employeeSlice.actions;

export default employeeSlice.reducer;
