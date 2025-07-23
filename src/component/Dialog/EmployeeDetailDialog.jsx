import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, List, ListItem, ListItemText, Divider,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import './EmployeeDetailDialog.scss'
import {
  Info as InfoIcon,
  AccountBox as AccountBoxIcon,
  Description as DescriptionIcon,
  Description,
  CommentSharp,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { renderContent } from '../renderContent/renderContent';
import { useDispatch } from 'react-redux';
import { updateEmployee } from '../../store/employeeSlice';

const EmployeeDetailDialog = ({ open, onClose, employee, onview = false }) => {
  const initialTab = employee?.status === 'Chờ duyệt kết thúc' ? 'resignationForm' : 'info';
  const [selectedTab, setSelectedTab] = useState(initialTab);
  useEffect(() => {
  if (employee?.status === 'Chờ duyệt kết thúc') {
    setSelectedTab('resignationForm');
  } else {
    setSelectedTab('info');
  }
}, [employee?.status]);
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const tabOptions = employee?.status === 'Chờ duyệt kết thúc'
    ? [{ id: 'resignationForm', label: 'Đơn xin nghỉ việc' }]
    : [
        { id: 'info', label: 'Thông tin nhân viên' },
        { id: 'profile', label: 'Sơ yếu lý lịch' },
        { id: 'application', label: 'Đơn đăng ký' },
        { id: 'leaderComment', label: 'Ý kiến của lãnh đạo' }
      ];
  const iconMap = {
    info: <InfoIcon sx={{ mr: 1 }} />,
    profile: <AccountBoxIcon sx={{ mr: 1 }} />,
    application: <DescriptionIcon sx={{ mr: 1 }} />,
    leaderComment: <CommentSharp sx={{ mr: 1 }} />,
  };
  const [approveOpen, setApproveOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState('');
  const [requirementContent, setRequirementContent] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDate, setRejectDate] = useState('');
  const [isQualified, setIsQualified] = useState(false);
  const dispatch = useDispatch();
  const handleUpdateStatus = async (newStatus) => {
    try {
      const payload = {
        ...employee,
        status: newStatus,
        ...(newStatus === 'Đã duyệt' && {
          appointmentDate,
          isQualified
        }),
        ...(newStatus === 'Yêu cầu bổ sung' && {
          requirementContent
        }),
        ...(newStatus === 'Từ chối' && {
          rejectReason,
          rejectDate
        }),
      };

      await dispatch(updateEmployee(payload)).unwrap();

      toast.success('Cập nhật trạng thái thành công');
      onClose();

      if (newStatus === 'Đã duyệt') {
        navigate('/employeeManager');
      } else if (newStatus === 'Yêu cầu bổ sung' || newStatus === 'Từ chối') {
        navigate('/employees');
      }
      
      if (newStatus === 'Kết thúc') 
        navigate('/endedEmployees');

    } catch (err) {
      toast.error('Cập nhật thất bại');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {employee?.status === "Chờ duyệt kết thúc" ? <DialogTitle>Biểu mẫu chờ duyệt</DialogTitle> : <DialogTitle>Chi tiết hồ sơ nhân viên</DialogTitle>}
      <DialogContent sx={{ display: 'flex', minHeight: 400 }}>
        <Box
          sx={{
            width: 240,
            background: '#f9f9f9',
            borderRight: '1px solid #ddd',
            position: 'sticky',
            top: 0,
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <List disablePadding>
            {tabOptions.map((tab) => (
              <ListItem
                key={tab.id}
                selected={selectedTab === tab.id}
                onClick={() => setSelectedTab(tab.id)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedTab === tab.id ? '#e0f2f1' : 'transparent',
                  borderLeft: selectedTab === tab.id ? '4px solid #26a69a' : '4px solid transparent',
                  pl: 2,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#f1f1f1'
                  }
                }}
              >
                {iconMap[tab.id] || <Description sx={{ mr: 1 }} />}
                <ListItemText
                  primary={
                    <Typography fontWeight={selectedTab === tab.id ? 'bold' : 'normal'}>
                      {tab.label}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flex={1} px={3} py={2} sx={{ overflowY: 'auto' }}>
          {selectedTab === 'resignationForm'
            ? (
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
                  <Typography><b>Kính gửi:</b> Ban giám đốc Công ty {employee?.resignationForm?.company}</Typography>
                  <Typography><b>Tôi tên là:</b> {employee?.resignationForm?.name}</Typography>
                  <Typography><b>Hiện đang công tác tại:</b> {employee?.resignationForm?.position}</Typography>

                  <Typography mt={2}>
                    Tôi làm đơn này đề nghị Ban Giám đốc Công ty cho tôi xin nghỉ việc vì lý do: {employee?.resignationForm?.reason}
                  </Typography>


                  <Typography mt={2} >
                    Trong khi chờ đợi sự chấp thuận của Ban Giám đốc Công ty, tôi sẽ tiếp tục làm việc nghiêm túc
                    và tiến hành bàn giao công việc cũng như tài sản lại cho người quản lý trực tiếp của tôi là ông/bà: <strong>{employee?.resignationForm?.manager}</strong>
                  </Typography>

                </Box>

                <Box mt={4} sx={{ fontSize: 14 }}>
                  <Typography>Tôi xin chân thành cảm ơn!</Typography>

                  <Box display="flex" justifyContent="flex-end" alignItems="center" mt={3}>
                    <Typography>
                      {employee?.resignationForm?.location}, ngày {employee?.resignationForm?.day} tháng {employee?.resignationForm?.month} năm {employee?.resignationForm?.year}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Box textAlign="center">
                      <Typography fontWeight="bold">Người làm đơn</Typography>
                      <Typography mt={1} sx={{ textAlign: 'center' }}>
                        {employee?.resignationForm?.signer}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              )
            : renderContent(selectedTab, employee)
          }
        </Box>
      </DialogContent>
      <Divider />
     {user.role === "leader" && employee?.status === 'Chờ duyệt kết thúc' ? (
        <DialogActions sx={{ px: 3 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="outlined" color="error" onClick={() => handleUpdateStatus('Đã duyệt')}>Từ chối</Button>
          <Button variant="contained" color="success" onClick={() => handleUpdateStatus('Kết thúc')}>Phê duyệt</Button>
        </DialogActions>
      ) : (
        (user.role === "leader" && !onview) ? (
          <DialogActions sx={{ px: 3 }}>
            <Button onClick={onClose}>Hủy</Button>
            <Button variant="outlined" color="warning" onClick={() => setRequestOpen(true)}>Yêu cầu bổ sung</Button>
            <Button variant="outlined" color="error" onClick={() => setRejectOpen(true)}>Từ chối</Button>
            <Button variant="contained" color="success" onClick={() => setApproveOpen(true)}>Phê duyệt</Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ px: 3 }}>
            <Button onClick={onClose} sx={{ border: 1, borderRadius: 1, px: 2, py: 1 }}>Đóng</Button>
          </DialogActions>
        )
      )}

      <Dialog open={approveOpen} onClose={() => setApproveOpen(false)}>
        <DialogTitle>Phê duyệt hồ sơ</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={isQualified} onChange={e => setIsQualified(e.target.checked)} />}
            label="Đã đủ điều kiện phê duyệt"
          />
          <TextField
            type="date"
            label="Ngày hẹn"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => handleUpdateStatus('Đã duyệt')}>Xác nhận</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={requestOpen} onClose={() => setRequestOpen(false)}>
        <DialogTitle>Yêu cầu bổ sung</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            label="Nội dung yêu cầu"
            fullWidth
            value={requirementContent}
            onChange={(e) => setRequirementContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => handleUpdateStatus('Yêu cầu bổ sung')}>Gửi</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)}>
        <DialogTitle>Từ chối hồ sơ</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Ngày từ chối"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={rejectDate}
            onChange={(e) => setRejectDate(e.target.value)}
          />
          <TextField
            multiline
            rows={3}
            label="Lý do từ chối"
            fullWidth
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={() => handleUpdateStatus('Từ chối')}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
     
    </Dialog>
  );
};

export default EmployeeDetailDialog;
