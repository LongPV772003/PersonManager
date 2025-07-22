import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Stack, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, TextField, Button
} from '@mui/material';
import { CancelOutlined, Visibility, Archive } from '@mui/icons-material';
import axios from 'axios';
import EmployeeDetailDialog from '../component/Dialog/EmployeeDetailDialog';
import { toast } from 'react-toastify';

const EndedEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveDate, setArchiveDate] = useState('');
  const [archiveNumber, setArchiveNumber] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchEndedEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:3001/employees');
      const ended = res.data.filter(emp => emp.status === 'Kết thúc' || emp.status === 'Đã nộp lưu');
      const filtered = user.role === 'manager'
        ? ended.filter(emp => emp.createdBy === user.id)
        : ended;
      setEmployees(filtered);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách hồ sơ kết thúc");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndedEmployees();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return isNaN(date) ? '—' : date.toLocaleDateString('vi-VN');
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedEmployee(null);
    setDialogOpen(false);
  };

  const handleOpenArchiveDialog = (employee) => {
    setSelectedEmployee(employee);
    setArchiveDate('');
    setArchiveNumber('');
    setArchiveDialogOpen(true);
  };

  const [archiveErrors, setArchiveErrors] = useState({
    archiveDate: false,
    archiveNumber: false,
  });
  const handleArchiveSubmit = async () => {
    const errors = {
      archiveDate: !archiveDate,
      archiveNumber: !archiveNumber.trim(),
    };
    setArchiveErrors(errors);

    const hasError = Object.values(errors).some(e => e);
    if (hasError) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const payload = {
        ...selectedEmployee,
        decisionDate: archiveDate,
        archiveNumber,
        status: 'Đã nộp lưu'
      };

      await axios.put(`http://localhost:3001/employees/${selectedEmployee.id}`, payload);
      toast.success('Đã cập nhật trạng thái Nộp lưu');
      setArchiveDialogOpen(false);
      setSelectedEmployee(null);
      fetchEndedEmployees();
    } catch (err) {
      toast.error('Lỗi khi nộp lưu hồ sơ');
      console.error(err);
    }
  };


  return (
    <Box p={4}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <CancelOutlined color="error" />
        <Typography variant="h5" fontWeight={600}>
          Danh sách hồ sơ đã kết thúc
        </Typography>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : employees.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Không có hồ sơ kết thúc.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#ff9999' }}>
                <TableRow>
                  {['Họ tên', 'Phòng ban', 'Ngày kết thúc', 'Lý do', 'Trạng thái', 'Ngày QĐ', 'Số lưu', 'Hành động'].map((h, i) => (
                    <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map(emp => (
                  <TableRow key={emp.id} hover>
                    <TableCell align="center">{emp.name}</TableCell>
                    <TableCell align="center">{emp.team}</TableCell>
                    <TableCell align="center">{formatDate(emp.endDate)}</TableCell>
                    <TableCell align="center">{emp.endReason || '—'}</TableCell>
                    <TableCell align="center" sx={{ color: emp.status === 'Đã nộp lưu' ? 'green' : '#B10202' }}>
                      {emp.status}
                    </TableCell>
                    <TableCell align="center">{formatDate(emp.decisionDate)}</TableCell>
                    <TableCell align="center">{emp.archiveNumber || '—'}</TableCell>
                    <TableCell align="center" sx={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton color="primary" onClick={() => handleView(emp)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {emp.status === 'Kết thúc' && (
                        <Tooltip title="Nộp lưu hồ sơ">
                          <IconButton color="secondary" onClick={() => handleOpenArchiveDialog(emp)}>
                            <Archive />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <EmployeeDetailDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        employee={selectedEmployee}
        onview={true}
      />

      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nộp lưu hồ sơ</DialogTitle>
        <DialogContent>
          <TextField
            label="Ngày quyết định"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={archiveDate}
            onChange={(e) => setArchiveDate(e.target.value)}
            margin="normal"
            error={archiveErrors.archiveDate}
            helperText={archiveErrors.archiveDate ? "Vui lòng chọn ngày quyết định" : ""}
          />

          <TextField
            label="Số lưu"
            fullWidth
            value={archiveNumber}
            onChange={(e) => setArchiveNumber(e.target.value)}
            margin="normal"
            error={archiveErrors.archiveNumber}
            helperText={archiveErrors.archiveNumber ? "Vui lòng nhập số lưu" : ""}
          />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setArchiveDialogOpen(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleArchiveSubmit}>Xác nhận</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EndedEmployees;
