import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Stack, Chip
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeTable = ({ onEdit, onView, employees, onSuccess }) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      await axios.delete(`http://localhost:3001/employees/${id}`);
      toast.success("Xoá thành công!");
      onSuccess()
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
      case 'Đã nộp lưu':
      case 'Kết thúc':
        return '#1976d2'
      default:
        return 'default';
    }
  };
  const getCustomStyle = (status) => {
    switch (status) {
      case 'Đã nộp lưu':
        return {
          backgroundColor: '#02abd1ff',
          color: '#fff',
          border: 'none'
        };
      case 'Kết thúc':
        return {
          backgroundColor: '#d11302ff',
          color: '#fff',
          border: 'none'
        };
      default:
        return {};
    }
  };

  return (
   <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
    <Table>
      <TableHead sx={{ bgcolor: '#66cc66' }}>
        <TableRow>
          <TableCell sx={{ minWidth: 90, whiteSpace: 'nowrap' }}><strong>Tên</strong></TableCell>
          <TableCell sx={{ minWidth: 40, whiteSpace: 'nowrap' }}><strong>Giới tính</strong></TableCell>
          <TableCell sx={{ minWidth: 80, whiteSpace: 'nowrap' }}><strong>Team</strong></TableCell>
          <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap' }}><strong>Email</strong></TableCell>
          <TableCell sx={{ minWidth: 50, whiteSpace: 'nowrap' }}><strong>Trạng thái</strong></TableCell>
          <TableCell sx={{ minWidth: 50, whiteSpace: 'nowrap' }} align="right"><strong>Thao tác</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.id} hover>
            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{emp.name}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.gender}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.team}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{emp.email}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              <Chip
                label={emp.status}
                color={getStatusColor(emp.status)}
                sx={getCustomStyle(emp.status)}
                variant="outlined"
                size="small"
              />
            </TableCell>
            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {user.role === "manager" &&
                  ['Lưu mới', 'Yêu cầu bổ sung', 'Từ chối'].includes(emp.status) && (
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="info" onClick={() => onEdit(emp)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                {user.role === "leader" || ['Kết thúc', 'Đã nộp lưu', 'Chờ xử lý', 'Chờ duyệt', 'Đã duyệt', 'Chờ nộp hồ sơ', 'Từ chối'].includes(emp.status) && (
                  <Tooltip title="Xem">
                    <IconButton onClick={() => onView(emp)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                )}
                 {user.role === "leader" && (
                  <Tooltip title="Xem">
                    <IconButton onClick={() => onView(emp)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                )}
                {user.role === "manager" && emp.status === 'Lưu mới' && (
                  <Tooltip title="Xóa">
                    <IconButton color="error" onClick={() => handleDelete(emp.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)};

export default EmployeeTable;
