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
  async (employee) => {
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
  async (employee) => {
    await axios.put(`http://localhost:3001/employees/${employee.id}`, employee);
    return employee;
  }
);

export const updateEmployeeWithLeaderSubmission = createAsyncThunk(
  'employee/updateWithLeader',
  async ({ employeeData, profile, application, leaderSubmission }) => {
    const payload = {
      ...employeeData,
      profileRecords: profile,
      applicationRecords: application,
      leaderSubmission,
      status: 'Chờ xử lý'
    };
    await axios.put(`http://localhost:3001/employees/${employeeData.id}`, payload);
    return payload;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/delete',
  async (id) => {
    await axios.delete(`http://localhost:3001/employees/${id}`);
    return id;
  }
);

export const fetchApprovedEmployees = createAsyncThunk(
  'employee/fetchApproved',
  async (_, ) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.get('http://localhost:3001/employees');
    const approved = res.data.filter(emp => emp.status === 'Đã duyệt');
    return user.role === 'manager'
      ? approved.filter(emp => emp.createdBy === user.id)
      : approved;
  }
);

export const closeEmployeeRecord = createAsyncThunk(
  'employee/closeRecord',
  async ({ employee, quitApplycation }) => {
    const { endDate, endReason, resignationForm } = quitApplycation;

    const payload = {
      ...employee,
      status: 'Chờ duyệt kết thúc',
      endDate,
      endReason,
      resignationForm
    };

    await axios.put(`http://localhost:3001/employees/${employee.id}`, payload);
    return payload;
  }
);

export const addLeaderComment = createAsyncThunk(
  'employee/addLeaderComment',
  async ({ employeeId, comment }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const payload = {
      leaderComment: {
        leaderId: user.id,
        name: user.fullName,
        content: comment,
        date: new Date().toISOString()
      }
    };
    await axios.patch(`http://localhost:3001/employees/${employeeId}`, payload);
    return { employeeId, comment: payload.leaderComment };
  }
);

export const fetchEndedEmployees = createAsyncThunk(
  'employee/fetchEnded',
  async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.get('http://localhost:3001/employees');
    const ended = res.data.filter(emp => emp.status === 'Kết thúc' || emp.status === 'Đã nộp lưu');
    return user.role === 'manager'
      ? ended.filter(emp => emp.createdBy === user.id)
      : ended;
  }
);

export const archiveEmployeeRecord = createAsyncThunk(
  'employee/archiveRecord',
  async ({ employee, archiveDate, archiveNumber }) => {
    const payload = {
      ...employee,
      decisionDate: archiveDate,
      archiveNumber,
      status: 'Đã nộp lưu',
    };
    await axios.put(`http://localhost:3001/employees/${employee.id}`, payload);
    return payload;
  }
);

export const fetchPendingEmployees = createAsyncThunk(
  'employee/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get('http://localhost:3001/employees');
      const allPending = res.data.filter(emp => emp.status === 'Chờ xử lý' || emp.status === 'Chờ duyệt kết thúc' || emp.status === 'Chờ duyệt tăng lương' || emp.status === 'Chờ duyệt thăng chức' || emp.status === 'Chờ duyệt đề xuất/tham mưu');

      if (user.role === 'manager') {
        return allPending.filter(emp => emp.createdBy === user.id);
      } else if (user.role === 'leader') {
        return allPending.filter(emp => emp.leaderSubmission?.leaderId === user.id);
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue('Lỗi khi lấy danh sách chờ xử lý');
    }
  }
);

export const updateEmployeeProgress = createAsyncThunk(
  'employee/updateProgress',
  async ({ employeeId, progressType, dataList }, { rejectWithValue }) => {
    try {
      const keyMap = {
        register: 'registerProfile',
        salary: 'salaryProgress',
        promotion: 'promotionProgress',
        proposal: 'proposalProgress'
      };
      const key = keyMap[progressType] || 'unknown';

      if (key === 'unknown') throw new Error('Progress type không hợp lệ');

      const payload = { [key]: dataList };
      const res = await axios.patch(`http://localhost:3001/employees/${employeeId}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue('Lỗi khi cập nhật tiến trình');
    }
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

    leaderCommentDialogOpen: false,
    leaderComment: '',
    selectedEmployee: null,

    endDialogOpen: false,
    endDate: '',
    endReason: '',

    progressDialogOpen: false,
    selectedProgressEmployee: null
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
    },

    setLeaderCommentDialogOpen: (state, action) => {
      state.leaderCommentDialogOpen = action.payload;
    },
    setLeaderComment: (state, action) => {
      state.leaderComment = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    setEndDialogOpen: (state, action) => {
      state.endDialogOpen = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setEndReason: (state, action) => {
      state.endReason = action.payload;
    },
    setProgressDialogOpen: (state, action) => {
      state.progressDialogOpen = action.payload;
    },
    setSelectedProgressEmployee: (state, action) => {
      state.selectedProgressEmployee = action.payload;
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
    })

    .addCase(updateEmployeeWithLeaderSubmission.fulfilled, (state, action) => {
    const index = state.list.findIndex(e => e.id === action.payload.id);
    if (index !== -1) {
        state.list[index] = action.payload;
    }
    })
    .addCase(deleteEmployee.fulfilled, (state, action) => {
    state.list = state.list.filter(emp => emp.id !== action.payload);
    })

    .addCase(fetchApprovedEmployees.pending, (state) => {
    state.loading = true;
    })
    .addCase(fetchApprovedEmployees.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading = false;
    })
    .addCase(fetchApprovedEmployees.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
    })

    .addCase(closeEmployeeRecord.fulfilled, (state, action) => {
    const index = state.list.findIndex(e => e.id === action.payload.id);
    if (index !== -1) {
        state.list[index] = action.payload;
    }
    })

    .addCase(addLeaderComment.fulfilled, (state, action) => {
    const emp = state.list.find(e => e.id === action.payload.employeeId);
    if (emp) {
        if (!emp.leaderComments) emp.leaderComments = [];
        emp.leaderComments.push(action.payload.comment);
    }
    })
    .addCase(fetchEndedEmployees.pending, (state) => {
    state.loading = true;
    })
    .addCase(fetchEndedEmployees.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading = false;
    })
    .addCase(fetchEndedEmployees.rejected, (state) => {
    state.loading = false;
    })

    .addCase(archiveEmployeeRecord.fulfilled, (state, action) => {
    const index = state.list.findIndex(e => e.id === action.payload.id);
    if (index !== -1) {
        state.list[index] = action.payload;
    }
    })
    .addCase(fetchPendingEmployees.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchPendingEmployees.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    })
    .addCase(fetchPendingEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  }
});

export const {
  setOpenDialog, setEditData, setViewData,
  setRegisterDialogOpen, setRegisterData, setCurrentEmployeeId,

  setLeaderCommentDialogOpen, setLeaderComment,
  setSelectedEmployee, setEndDialogOpen, setEndDate, setEndReason,
  setProgressDialogOpen, setSelectedProgressEmployee
} = employeeSlice.actions;

export default employeeSlice.reducer;