import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { FaUser, FaClipboardCheck, FaClock } from 'react-icons/fa';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const employees = JSON.parse(localStorage.getItem('employees')) || [];

  const visibleEmployees = user.role === 'manager'
    ? employees.filter(e => e.createdBy === user.id)
    : employees;

  const totalEmployees = visibleEmployees.length;
  const approvedEmployees = visibleEmployees.filter(e => e.status === 'Đã duyệt').length;
  const pendingEmployees = visibleEmployees.filter(e => e.status === 'Chờ xử lý').length;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Xin chào, {user?.fullName || 'người dùng'} 👋
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Chào mừng bạn đến với hệ thống quản lý nhân sự.
      </Typography>

      <Divider sx={{ my: 3 }} />

    </Box>
  );
};

export default Home;
