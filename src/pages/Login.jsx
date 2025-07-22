import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, TextField, Button,
  Grid, Paper
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../store/leaderSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check nếu đã login thì chuyển hướng luôn
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) navigate('/');
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const user = await dispatch(login({ username, password })).unwrap();
      toast.success(`Xin chào ${user.fullName}`);
      navigate('/');
    } catch (errMsg) {
      toast.error(errMsg);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ gap: 10, px: 10 }}>
        <Box width="50%">
          <Typography variant="h3" fontWeight="bold" color="#1877f2">
            Long Phạm
          </Typography>
        </Box>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 400, margin: 'auto' }}>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: 16 }}
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>
            <Typography align="center" sx={{ mt: 2, color: '#1877f2', cursor: 'pointer' }}>
              Quên mật khẩu?
            </Typography>
            <Box sx={{ borderBottom: '1px solid #ccc', my: 3 }} />
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#42b72a', py: 1.5, fontWeight: 'bold', fontSize: 16 }}
              >
                Tạo tài khoản mới
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;