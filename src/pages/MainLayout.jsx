import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, Drawer } from '@mui/material';
import Sidebar from '../component/Sidebar/SideBar';
import Header from '../component/Header/Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          transition: 'all 0.3s ease',
          zIndex: 20,
          overflow: 'hidden',
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          height: isMobile ? '100%' : 'auto',
          boxShadow: isMobile && isSidebarOpen ? 3 : 'none',
          bgcolor: isMobile ? 'background.paper' : 'primary.main',
          color: isMobile ? 'black' : 'white',
          width: isSidebarOpen ? 240 : 0,
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Box>

      {isMobile && (
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleSidebar}
          sx={{
            '& .MuiDrawer-paper': {
              width: 240,
              bgcolor: 'primary.main',
              color: 'white',
            },
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: '#f5f5f5',
            p: 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
