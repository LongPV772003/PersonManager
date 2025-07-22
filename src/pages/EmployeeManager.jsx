import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Stack, IconButton, Tooltip,
  DialogContent,
  DialogTitle,
  TextField,
  Dialog,
  Button
} from '@mui/material';
import { TaskAlt as TaskAltIcon, Visibility, Edit, CancelOutlined, Feedback } from '@mui/icons-material';
import EmployeeDetailDialog from '../component/Dialog/EmployeeDetailDialog';
import { toast } from 'react-toastify';
import UpdateProcessDialog from '../component/Dialog/UpdateProcessDialog';
import { useSelector, useDispatch } from 'react-redux';
import { addLeaderComment, closeEmployeeRecord, fetchApprovedEmployees  } from '../store/employeeSlice';

const EmployeeManager = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [onview, setOnview] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [leaderComment, setLeaderComment] = useState("");
    
  const dispatch = useDispatch();
  const { list: employees, loading } = useSelector(state => state.employee);
  const handleLeaderComment = (employeeId) => {
    setCurrentEmployeeId(employeeId);
    setLeaderComment('');
    setCommentDialogOpen(true);
  };
  const submitLeaderComment = () => {
    if (!leaderComment) return;
    dispatch(addLeaderComment({ employeeId: currentEmployeeId, comment: leaderComment }))
      .then(() => {
        toast.success('Đã thêm ý kiến lãnh đạo');
        dispatch(fetchApprovedEmployees());
        setCommentDialogOpen(false);
      })
      .catch(() => toast.error('Lỗi khi thêm ý kiến'));
  };
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [endReason, setEndReason] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleCloseRecord = (employee) => {
    setSelectedEmployee(employee);
    setEndDate('');
    setEndReason('');
    setEndDialogOpen(true);
  };
   const submitCloseRecord = () => {
    if (!endDate || !endReason) return toast.error('Vui lòng nhập đầy đủ');
    dispatch(closeEmployeeRecord({
      employee: selectedEmployee,
      endDate,
      endReason
    }))
      .then(() => {
        toast.success('Đã kết thúc hồ sơ');
        setEndDialogOpen(false);
        window.location.href = '/endedEmployees';
      })
      .catch(() => toast.error('Lỗi khi kết thúc hồ sơ'));
  };

  useEffect(() => {
    dispatch(fetchApprovedEmployees());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return isNaN(date) ? '—' : date.toLocaleDateString('vi-VN');
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee)
    setDialogOpen(true)
    setOnview(true)
  };
  const handleCloseDialog = (employee) => {
    setSelectedEmployee(null)
    setDialogOpen(false)
  }
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [selectedProgressEmployee, setSelectedProgressEmployee] = useState(null);

  const handleUpdateProgress = (employee) => {
    setSelectedProgressEmployee(employee);
    setProgressDialogOpen(true);
  };


  return (
    <Box p={4}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <TaskAltIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Danh sách nhân viên đã duyệt
        </Typography>
      </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : employees.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            Không có nhân viên nào đã được duyệt.
          </Typography>
        ) : (
          <TableContainer sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#66cc66' }}>
                <TableRow>
                  {[
                    'Họ tên', 'Giới tính', 'Ngày sinh', 'Email', 'SĐT', 'Ngày hẹn', 'Hành động'
                  ].map((head, index) => (
                    <TableCell key={index} align="center" sx={{ fontWeight: 'bold' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} hover sx={{ '&:hover': { backgroundColor: '#f1f8e9' } }}>
                    <TableCell align="center">{emp.name}</TableCell>
                    <TableCell align="center">{emp.gender}</TableCell>
                    <TableCell align="center">{formatDate(emp.dob)}</TableCell>
                    <TableCell align="center">{emp.email}</TableCell>
                    <TableCell align="center">{emp.phone}</TableCell>
                    <TableCell align="center">{formatDate(emp.appointmentDate)}</TableCell>
                    <TableCell align="center" sx={{ minWidth: 160 }}>
                        {user.role === "manager" ? 
                        <Box display="flex" justifyContent="center" gap={1}>
                            <Tooltip title="Xem chi tiết">
                            <IconButton color="primary" onClick={() => handleView(emp)}>
                                <Visibility />
                            </IconButton>
                            </Tooltip>
                            <Tooltip title="Cập nhật diễn biến">
                            <IconButton color="warning" onClick={() => handleUpdateProgress(emp)}>
                                <Edit />
                            </IconButton>
                            </Tooltip>
                            <Tooltip title="Kết thúc hồ sơ">
                            <IconButton color="error" onClick={() => handleCloseRecord(emp)}>
                                <CancelOutlined />
                            </IconButton>
                            </Tooltip>
                        </Box> : <Box display="flex" justifyContent="center" gap={1}>
                            <Tooltip title="Xem chi tiết">
                            <IconButton color="primary" onClick={() => handleView(emp)}>
                                <Visibility />
                            </IconButton>
                            </Tooltip>
                            <Tooltip title="Ý kiến lãnh đạo">
                                <IconButton color="secondary" onClick={() => handleLeaderComment(emp.id)}>
                                <Feedback />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
    <EmployeeDetailDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        employee={selectedEmployee}
        onview={onview}
    />
    <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm ý kiến lãnh đạo</DialogTitle>
        <DialogContent>
            <TextField
            label="Ý kiến"
            value={leaderComment}
            onChange={(e) => setLeaderComment(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            />
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setCommentDialogOpen(false)}>Hủy</Button>
            <Button variant="contained" onClick={submitLeaderComment}>Lưu</Button>
            </Box>
        </DialogContent>
    </Dialog>
    <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Kết thúc hồ sơ</DialogTitle>
        <DialogContent>
            <TextField
            label="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            />
            <TextField
            label="Lý do kết thúc"
            value={endReason}
            onChange={(e) => setEndReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            />
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setEndDialogOpen(false)}>Hủy</Button>
            <Button variant="contained" color="error" onClick={submitCloseRecord}>Xác nhận</Button>
            </Box>
        </DialogContent>
    </Dialog>
    <UpdateProcessDialog
      open={progressDialogOpen}
      data={selectedProgressEmployee}
      onClose={() => setProgressDialogOpen(false)}
      reLoad={() => dispatch(fetchApprovedEmployees())}
    />
    </Box>
  );
};
export default EmployeeManager;
