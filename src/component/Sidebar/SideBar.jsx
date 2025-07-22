import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Stack
} from '@mui/material';
import { FaHome, FaBox, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [openManage, setOpenManage] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: 'primary.main',
        color: 'white',
        p: 2,
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Person Management
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }}>{user.fullName.slice(0,1)}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {user.fullName}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            role: {user.role}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />

      <List component="nav">
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemIcon sx={{ color: 'white' }}><FaHome /></ListItemIcon>
          <ListItemText primary="Trang chủ" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/categories')}>
          <ListItemIcon sx={{ color: 'white' }}><FaBox /></ListItemIcon>
          <ListItemText primary="Danh mục" />
        </ListItemButton>

        <ListItemButton onClick={() => setOpenManage(!openManage)}>
          <ListItemIcon sx={{ color: 'white' }}><FaUsers /></ListItemIcon>
          <ListItemText primary="Quản lý" />
          {openManage ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openManage} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/employees')}>
              <ListItemText primary="Thêm mới nhân viên" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/penddingApproval')}>
              <ListItemText primary="Lãnh đạo/Chờ duyệt" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/employeeManager')}>
              <ListItemText primary="Quản lý nhân viên" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/endedEmployees')}>
              <ListItemText primary="Kết thúc" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      <Box sx={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 1 }} />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'white' }}>
            <FaSignOutAlt />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
