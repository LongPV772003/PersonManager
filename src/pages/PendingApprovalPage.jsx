import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  Chip
} from '@mui/material';
import axios from 'axios';
import EmployeeDetailDialog from '../component/Dialog/EmployeeDetailDialog';

const PendingApprovalPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/employees');
      const allPending = res.data.filter(emp => emp.status === 'Chờ xử lý');

      if (user.role === 'manager') {
        const filteredManager = allPending.filter(emp => emp.createdBy === user.id)
        setEmployees(filteredManager);
      } else if (user.role === 'leader') {
        const filteredLeader = allPending.filter(emp => emp.leaderSubmission?.leaderId === user.id);
        setEmployees(filteredLeader);
      } else {
        setEmployees([]);
      }

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

    const getStatusColor = (status) => {
    switch (status) {
      case 'Lưu mới':
        return 'info';
      case 'Từ chối':
        return 'error';
      case 'Yêu cầu bổ sung':
        return 'warning';
      case 'Chờ xử lý':
      case 'Chờ duyệt':
        return 'secondary';
      case 'Đã duyệt':
        return 'success';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Danh sách hồ sơ chờ lãnh đạo phê duyệt
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#66cc66' }}>
              <TableCell align="center"><strong>Mã NV</strong></TableCell>
              <TableCell align="center"><strong>Họ tên</strong></TableCell>
              <TableCell align="center"><strong>Phòng ban</strong></TableCell>
              <TableCell align="center"><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Trạng thái</strong></TableCell>
              <TableCell align="center"><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp, index) => (
              <TableRow
                key={emp.id}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: '#fafafa'
                  }
                }}
              >
                <TableCell align="center">{emp.code}</TableCell>
                <TableCell align="center">{emp.name}</TableCell>
                <TableCell align="center">{emp.team}</TableCell>
                <TableCell align="center">{emp.email}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={emp.status}
                    color={getStatusColor(emp.status)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(emp)}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có hồ sơ nào chờ duyệt
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <EmployeeDetailDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        employee={selectedEmployee}
      />
    </Container>
  );
};

export default PendingApprovalPage;
