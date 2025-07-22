import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Box, Button, Typography, Divider
} from '@mui/material';
import ProfileForm from '../tabs/ProfileForm';
import ApplicationForm from '../tabs/ApplicationForm';
import { AssignmentInd, Description } from '@mui/icons-material';
import SubmitToLeaderDialog from './LeaderDialog';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRegisterData } from '../../store/employeeSlice';
import { updateEmployeeWithLeaderSubmission } from '../../store/employeeSlice';

const documentTypes = [
  { id: 'profile', label: 'Sơ yếu lý lịch', icon: <AssignmentInd /> },
  { id: 'application', label: 'Đơn đăng ký', icon: <Description /> }
];

const RegisterProfileDialog = ({ open, onClose, data, setData, onSubmit, employeeData }) => {
  const [selectedDoc, setSelectedDoc] = useState('profile');
  const [leaderDialogOpen, setLeaderDialogOpen] = useState(false);
  const navigate = useNavigate()
  const profileRef = useRef();
  const applicationRef = useRef()
  const dispatch = useDispatch();
  const currentData = useSelector(state => state.employee.registerData);

  const handleChange = (docId, newData) => {
    dispatch(setRegisterData({
      ...currentData,
      [docId]: newData
    }));
  };
  useEffect(() => {
    if (open && employeeData) {
      setData({
        profile: {
          ...(employeeData.profileRecords || {}),
          families: employeeData.families || []
        },
        application: employeeData.applicationRecords || {},
      });
    }
  }, [open, employeeData]);


  const handleSave = () => {
    onSubmit(data);
    onClose()
  };
  const handleLeaderSubmit = async (leaderForm) => {
  try {
    await dispatch(updateEmployeeWithLeaderSubmission({
      employeeData,
      profile: data.profile,
      application: data.application,
      leaderSubmission: leaderForm
    })).unwrap();

    toast.success("Đã trình lãnh đạo thành công!");
    navigate('/penddingApproval');
    onClose();
  } catch (error) {
    toast.error("Có lỗi khi trình lãnh đạo");
    console.error(error);
  }
};
  const handleSendToLeaderClick = () => {
    const isProfileValid = profileRef.current?.validate?.() ?? true;
    const isApplicationValid = applicationRef.current?.validate?.() ?? true;
    if(!isProfileValid && !isApplicationValid){
      toast.error('Vui lòng điền đầy đủ thông tin Sơ yếu lý lịch và Đơn đăng ký!');
      return;
    }
    if (!isProfileValid) {
      toast.error('Vui lòng điền đầy đủ thông tin Sơ yếu lý lịch!');
      setSelectedDoc('profile')
      return;
    }
    if (!isApplicationValid) {
      toast.error('Vui lòng điền đầy đủ thông tin Đơn đăng ký!');
      setSelectedDoc('application')
      return;
    }
      setLeaderDialogOpen(true);
      onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Đăng ký hồ sơ nhân viên</DialogTitle>
      <DialogContent sx={{ display: 'flex', minHeight: 400, p: 0 }}>
        <Box
          sx={{
            width: 180,
            background: '#f9f9f9',
            borderRight: '1px solid #ddd',
            position: 'sticky',
            top: 0,
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <List disablePadding>
            {documentTypes.map((doc) => (
              <ListItem
                key={doc.id}
                selected={selectedDoc === doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedDoc === doc.id ? '#e0f2f1' : 'transparent',
                  borderLeft: selectedDoc === doc.id ? '4px solid #26a69a' : '4px solid transparent',
                  pl: 2,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#f1f1f1'
                  }
                }}
              >
                {doc.icon}
                <ListItemText
                  primary={
                    <Typography fontWeight={selectedDoc === doc.id ? 'bold' : 'normal'} ml={1}>
                      {doc.label}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex={1} px={3} py={2} sx={{ overflowY: 'auto', maxHeight: '550px' }}>
          <div style={{ display: selectedDoc === 'profile' ? 'block' : 'none' }}>
            <ProfileForm ref={profileRef} data={data?.profile || {}} onChange={(d) => handleChange('profile', d)} />
          </div>
          <div style={{ display: selectedDoc === 'application' ? 'block' : 'none' }}>
            <ApplicationForm ref={applicationRef} data={data?.application || {}} onChange={(d) => handleChange('application', d)} />
          </div>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="outlined" onClick={handleSave}>Lưu</Button>
        <Button variant="contained" color="success" onClick={handleSendToLeaderClick}>Gửi lãnh đạo</Button>
      </DialogActions>
      <SubmitToLeaderDialog
        open={leaderDialogOpen}
        onClose={() => setLeaderDialogOpen(false)}
        onSubmit={handleLeaderSubmit}
      />
    </Dialog>
  );
};

export default RegisterProfileDialog;
