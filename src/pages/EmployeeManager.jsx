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
import axios from 'axios';
import EmployeeDetailDialog from '../component/Dialog/EmployeeDetailDialog';
import { toast } from 'react-toastify';
import UpdateProcessDialog from '../component/Dialog/UpdateProcessDialog';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'))
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [onview, setOnview] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
    const [leaderComment, setLeaderComment] = useState("");
    

    const handleLeaderComment = (employeeId) => {
        setCurrentEmployeeId(employeeId);
        setLeaderComment('');
        setCommentDialogOpen(true);
    };
    const submitLeaderComment = async () => {
        try {
          const payload = {
            leaderComment: {
              leaderId: user.id,
              name: user.fullName,
              content: leaderComment,
              date: new Date().toISOString()
            }
          };
          await axios.patch(`http://localhost:3001/employees/${currentEmployeeId}`, payload);
          toast.success('Đã thêm ý kiến lãnh đạo');
          setCommentDialogOpen(false);
          fetchApprovedEmployees();
        } catch (err) {
            toast.error('Lỗi khi thêm ý kiến');
            console.error(err);
        }
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
    const submitCloseRecord = async () => {
        if (!endDate || !endReason) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            const payload = {
            ...selectedEmployee,
            status: 'Kết thúc',
            endDate,
            endReason
            };
            await axios.put(`http://localhost:3001/employees/${selectedEmployee.id}`, payload);
            toast.success("Đã kết thúc hồ sơ");
            setEndDialogOpen(false);
            fetchApprovedEmployees(); 
            window.location.href = '/endedEmployees';
        } catch (err) {
            toast.error("Lỗi khi cập nhật hồ sơ");
            console.error(err);
        }
    };

    const fetchApprovedEmployees = async () => {
        try {
        const res = await axios.get('http://localhost:3001/employees');
        const approved = res.data.filter(emp => emp.status === 'Đã duyệt');
        if(user.role === "manager"){
            const data = approved.filter(a => a.createdBy === user.id)
            setEmployees(data);
        }
        else{
            setEmployees(approved);
        }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên đã duyệt:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedEmployees();
    }, []);

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
      reLoad = {fetchApprovedEmployees()}
    />
    </Box>
  );
};
export default EmployeeManager;
