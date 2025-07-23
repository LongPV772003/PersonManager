import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaders } from '../../store/leaderSlice';

const SubmitToLeaderDialog = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    leader: '',
    leaderId: '',
    position: '',
    content: ''
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const leaders = useSelector(state => state.leader.list);
  console.log(leaders)
  useEffect(() => {
    if (open) {
      dispatch(fetchLeaders());
    }
  }, [open, dispatch]);

  const handleChange = (field, value) => {
    if (field === 'leader') {
      const selected = leaders.find(l => l.fullName === value);
      setForm(prev => ({
        ...prev,
        leader: value,
        leaderId: selected?.id || '',
        position: selected?.position || ''
      }));
      setErrors(prev => ({ ...prev, leader: '' }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value
      }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!form.leader || form.leader === 'chose') newErrors.leader = 'Vui lòng chọn lãnh đạo';
    if (!form.content || form.content.trim() === '') newErrors.content = 'Vui lòng nhập nội dung trình';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Trình lãnh đạo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth type="date" label="Ngày trình"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth select
              label="Tên lãnh đạo"
              value={form.leader || 'chose'}
              onChange={(e) => handleChange('leader', e.target.value)}
              error={!!errors.leader}
              helperText={errors.leader}
            >
              <MenuItem value="chose">Chọn lãnh đạo</MenuItem>
              {leaders.map((l) => (
                <MenuItem key={l.id} value={l.fullName}>{l.fullName}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Chức vụ"
              value={form.position}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={4}
              label="Nội dung trình lãnh đạo"
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              error={!!errors.content}
              helperText={errors.content}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>Trình lãnh đạo</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitToLeaderDialog;