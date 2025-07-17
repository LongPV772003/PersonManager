import React from 'react';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  Box,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const Header = ({ onToggleSidebar }) => {
  const [lang, setLang] = React.useState('vi');

  return (
    <Box
      sx={{
        bgcolor: 'white',
        boxShadow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5
      }}
    >
      <IconButton onClick={onToggleSidebar}>
        <MenuIcon />
      </IconButton>

      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl size="small">
          <InputLabel id="lang-label">Ngôn ngữ</InputLabel>
          <Select
            labelId="lang-label"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            label="Ngôn ngữ"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="vi">Tiếng Việt</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>
        <Avatar sx={{ width: 32, height: 32 }} />
      </Stack>
    </Box>
  );
};

export default Header;
