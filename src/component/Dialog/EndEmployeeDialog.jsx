import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Box, TextField, Button, Typography
} from '@mui/material';
import { toast } from 'react-toastify';

const EndEmployeeDialog = forwardRef(({ open, onClose, onSubmit,data }, ref) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [endReason, setEndReason] = useState('');
  const [form, setForm] = useState({
    company: '',
    name: '',
    position: '',
    reason: '',
    manager: '',
    day: '',
    month: '',
    year: '',
    location: '',
    signer: ''
  });
  console.log(data)
  useEffect(() => {
    if (data) {
        if (data.endDate) setEndDate(data.endDate);
        if (data.endReason) setEndReason(data.endReason);
        if (data.resignationForm) {
        setForm(prev => ({ ...prev, ...data.resignationForm }));
        }
    }
    }, [data]);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!endDate || !endReason) {
      setTabIndex(0);
      toast.error('Vui lòng nhập ngày và lý do kết thúc!');
      return false;
    }

    const requiredFields = ['company', 'name', 'position', 'reason', 'manager', 'location', 'day', 'month', 'year', 'signer'];
    const missing = requiredFields.find(field => !form[field]?.trim());

    if (missing) {
      setTabIndex(1);
      toast.error('Vui lòng nhập đầy đủ đơn xin nghỉ việc!');
      return false;
    }

    return true;
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit: () => {
      if (validate()) {
        onSubmit({ endDate, endReason, resignationForm: form });
      }
    }
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Kết thúc hồ sơ</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
          <Tab label="Thông tin kết thúc" />
          <Tab label="Đơn xin nghỉ việc" />
        </Tabs>
        <Box mt={2}>
          {tabIndex === 0 && (
            <>
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
            </>
          )}
          {tabIndex === 1 && (
            <Box sx={{ px: 2, fontFamily: '"Times New Roman", serif' }}>
              <Typography align="center" fontWeight="bold" sx={{ fontSize: 16 }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Typography>
              <Typography align="center" sx={{ fontSize: 14 }}>
                Độc lập – Tự do – Hạnh phúc
              </Typography>
              <Typography align="center" mt={1} fontWeight="bold" sx={{ fontSize: 16 }}>
                ĐƠN XIN NGHỈ VIỆC
              </Typography>

              <Box mt={4} sx={{ fontSize: 14, lineHeight: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography marginRight={1}>Kính gửi: Ban giám đốc Công ty</Typography>
                  <TextField
                    variant="standard"
                    value={form.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography sx={{ width: 90 }}>Tôi tên là:</Typography>
                  <TextField
                    variant="standard"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography sx={{ width: 180 }}>Hiện đang công tác tại:</Typography>
                  <TextField
                    variant="standard"
                    value={form.position}
                    onChange={(e) => handleFormChange('position', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Typography mb={1}>
                  Tôi làm đơn này đề nghị Ban Giám đốc Công ty cho tôi xin nghỉ việc vì lý do:
                </Typography>

                <TextField
                  variant="standard"
                  value={form.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />

                <Typography mt={2}>
                  Trong khi chờ đợi sự chấp thuận của Ban Giám đốc Công ty, tôi sẽ tiếp tục làm việc nghiêm túc và tiến hành bàn giao công việc cũng như tài sản lại cho người quản lý trực tiếp của tôi là ông/bà:
                </Typography>

                <TextField
                  variant="standard"
                  value={form.manager}
                  onChange={(e) => handleFormChange('manager', e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box mt={4} sx={{ fontSize: 14 }}>
                <Typography>Tôi xin chân thành cảm ơn!</Typography>

                <Box display="flex" justifyContent="flex-end" alignItems="center" mt={3} gap={1}>
                    <TextField
                        variant="standard"
                        value={form.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        sx={{ width: 100 }}
                    />
                    <Typography> , ngày</Typography>
                    <TextField
                        variant="standard"
                        value={form.day}
                        onChange={(e) => handleFormChange('day', e.target.value)}
                        sx={{ width: 30 }}
                    />
                    <Typography>tháng</Typography>
                    <TextField
                        variant="standard"
                        value={form.month}
                        onChange={(e) => handleFormChange('month', e.target.value)}
                        sx={{ width: 30 }}
                    />
                    <Typography>năm</Typography>
                    <TextField
                        variant="standard"
                        value={form.year}
                        onChange={(e) => handleFormChange('year', e.target.value)}
                        sx={{ width: 50 }}
                    />
                    </Box>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Box textAlign="center">
                        <Typography fontWeight="bold">Người làm đơn</Typography>
                        <TextField
                        variant="standard"
                        value={form.signer}
                        onChange={(e) => handleFormChange('signer', e.target.value)}
                        sx={{ mt: 1, width: 200 }}
                        inputProps={{ style: { textAlign: 'center' } }}
                        placeholder="Họ tên"
                        />
                    </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

       <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button
            variant="contained"
            color="error"
            onClick={() => {
            if (validate()) {
                onSubmit({ endDate, endReason, resignationForm: form });
            }
            }}
        >
            Xác nhận
        </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
});

export default EndEmployeeDialog;