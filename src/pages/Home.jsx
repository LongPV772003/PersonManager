import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

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
