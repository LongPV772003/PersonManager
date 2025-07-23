import React, { useEffect, useRef, useState } from 'react';
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
import PaginationTableWrapper from '../component/Panigation/PaginationTableWrapper';
import EndEmployeeDialog from '../component/Dialog/EndEmployeeDialog';

const EmployeeManager = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [onview, setOnview] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [leaderComment, setLeaderComment] = useState("");
  const endDialogRef = useRef();
    
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
  const handleCloseRecord = (employee) => {
    setSelectedEmployee(employee);
    setEndDialogOpen(true);
  };
   const submitCloseRecord = (data) => {
    dispatch(closeEmployeeRecord({
      employee: selectedEmployee,
      quitApplycation: data
    }))
      .then(() => {
        toast.success('Đã kết thúc hồ sơ');
        setEndDialogOpen(false);
        window.location.href = '/penddingApproval';
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
    <Box px={2} py={1}>
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
          <PaginationTableWrapper
            data={employees}
            rowsPerPage={4}
            renderTable={(visibleEmployees) => (
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#13ece1ff' }}>
                    <TableRow>
                      {['Họ tên', 'Giới tính', 'Ngày sinh', 'Email', 'SĐT', 'Ngày hẹn', 'Hành động'].map((head, index) => (
                        <TableCell key={index} align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleEmployees.map((emp) => (
                      <TableRow key={emp.id} hover sx={{ '&:hover': { backgroundColor: '#f1f8e9' } }}>
                        <TableCell align="center">{emp.name}</TableCell>
                        <TableCell align="center">{emp.gender}</TableCell>
                        <TableCell align="center">{formatDate(emp.dob)}</TableCell>
                        <TableCell align="center">{emp.email}</TableCell>
                        <TableCell align="center">{emp.phone}</TableCell>
                        <TableCell align="center">{formatDate(emp.appointmentDate)}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton color="primary" onClick={() => handleView(emp)}>
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            {user.role === 'manager' ? (
                              <>
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
                              </>
                            ) : (
                              <Tooltip title="Ý kiến lãnh đạo">
                                <IconButton color="secondary" onClick={() => handleLeaderComment(emp.id)}>
                                  <Feedback />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          />
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
    <EndEmployeeDialog
      open={endDialogOpen}
      onClose={() => setEndDialogOpen(false)}
      onSubmit={(data) => {
        submitCloseRecord(data)
      }}
      ref={endDialogRef}
      data={selectedEmployee}
    />
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
