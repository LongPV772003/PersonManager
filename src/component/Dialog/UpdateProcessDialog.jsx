import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TableContainer,
  Paper
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';
import ViewProgressTemplateDialog from './ViewProgressTemplateDialog';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployeeProgress } from '../../store/employeeSlice';

const UpdateProcessDialog = ({ open, data, onClose, reLoad }) => {
  const [progressType, setProgressType] = useState("");
  const [formData, setFormData] = useState({ submittedFiles: [] });
  const [editIndex, setEditIndex] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dataEmployee, setDataEmployee] = useState(null)
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (row, index) => {
    setFormData(row);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const keyMap = {
      register: 'registerProfile',
      salary: 'salaryProgress',
      promotion: 'promotionProgress',
      proposal: 'proposalProgress'
    };
    const key = keyMap[progressType] || 'unknown';

    if (key === 'unknown') {
      toast.error('Loại diễn biến không hợp lệ');
      return;
    }

    const updatedList = [...(data[key] || [])];
    updatedList.splice(index, 1);

    try {
      await dispatch(updateEmployeeProgress({
        employeeId: data.id,
        progressType,
        dataList: updatedList
      })).unwrap();

      toast.success('Xoá thành công');
      onClose();
    } catch (err) {
      toast.error('Lỗi khi xoá diễn biến');
    }
  };

  const handleSave = async () => {
    const keyMap = {
      register: 'registerProfile',
      salary: 'salaryProgress',
      promotion: 'promotionProgress',
      proposal: 'proposalProgress'
    };
    const key = keyMap[progressType] || 'unknown';

    if (key === 'unknown') {
      toast.error('Loại diễn biến không hợp lệ');
      return;
    }

    const updatedList = [...(data[key] || [])];
    if (editIndex !== null) {
      updatedList[editIndex] = formData;
    } else {
      updatedList.push(formData);
    }

    try {
      await dispatch(updateEmployeeProgress({
        employeeId: data.id,
        progressType,
        dataList: updatedList
      })).unwrap();

      toast.success(
        editIndex !== null
          ? 'Chỉnh sửa thành công'
          : progressType === 'register' ? 'Thêm đăng ký hồ sơ thành công' :
            progressType === 'salary' ? 'Thêm tăng lương thành công' :
            progressType === 'promotion' ? 'Thêm thăng chức thành công' :
            progressType === 'proposal' ? 'Thêm đề xuất thành công' :
            'Thêm thành công'
      );

      setEditIndex(null);
      setFormData({ submittedFiles: [] });
      onClose();
      reLoad();
    } catch (err) {
      toast.error('Lỗi khi lưu diễn biến');
    }
  };


  const handleViewTemplate = (data, row) => {
    setDataEmployee(data)
    setSelectedRow(row);
    setOpenViewDialog(true);
  };

  const renderExtra = (row) => {
    if (progressType === 'register') {
      return (row.submittedFiles || []).map((f, i) => (
        <div key={i}>{f.name} ({f.date})</div>
      ));
    } else if (progressType === 'proposal') {
      return `${row.proposalType || ''} - ${row.description || ''}`;
    } else if (progressType === 'salary') {
      return `Lần: ${row.times || '-'}, Bậc: ${row.level || '-'}`;
    } else if (progressType === 'promotion') {
      return `Từ: ${row.oldPosition || '-'} → ${row.newPosition || '-'}`;
    }
    return null;
  };

  const renderHistoryTable = () => {
    const key =
      progressType === 'register' ? 'registerProfile' :
      progressType === 'salary' ? 'salaryProgress' :
      progressType === 'promotion' ? 'promotionProgress' :
      progressType === 'proposal' ? 'proposalProgress' :
      'unknown';
    const list = data[key] || [];

    return (
    <Box mt={4}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
        Danh sách đã lưu
    </Typography>

    <TableContainer component={Paper} elevation={2}>
        <Table size="small">
        <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ngày</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Chi tiết</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 120 }}>Thao tác</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {list.map((row, idx) => (
            <TableRow
                key={idx}
                sx={{
                '&:hover': { backgroundColor: '#f9f9f9' },
                borderBottom: '1px solid #e0e0e0'
                }}
            >
                <TableCell sx={{ textAlign: 'center' }}>{row.date || ''}</TableCell>
                <TableCell>{row.content || row.reason || ''}</TableCell>
                <TableCell>{row.note || ''}</TableCell>
                <TableCell>{renderExtra(row)}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                {progressType !== 'register' && (
                    <IconButton onClick={() => handleViewTemplate(data, row)}>
                    <Visibility fontSize="small" />
                    </IconButton>
                )}
                <IconButton color="primary" onClick={() => handleEdit(row, idx)}>
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(idx)}>
                    <Delete fontSize="small" />
                </IconButton>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    </Box>
    );
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cập nhật diễn biến</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Loại diễn biến"
          value={progressType || ''}
          onChange={(e) => {
            setProgressType(e.target.value);
            setFormData({ submittedFiles: [] });
            setEditIndex(null);
          }}
          fullWidth
          SelectProps={{ native: true }}
          margin="normal"
        >
          <option value="register">Đăng ký hồ sơ</option>
          <option value="salary">Tăng lương</option>
          <option value="promotion">Thăng chức</option>
          <option value="proposal">Đề xuất / Tham mưu</option>
        </TextField>

        {progressType === 'register' && (
          <>
            <TextField label="Ngày đăng ký" type="date" fullWidth InputLabelProps={{ shrink: true }} margin="normal" value={formData.date || ''} onChange={e => handleChange('date', e.target.value)} />
            <TextField label="Nội dung" fullWidth margin="normal" value={formData.content || ''} onChange={e => handleChange('content', e.target.value)} />
            <TextField label="Ghi chú" fullWidth margin="normal" value={formData.note || ''} onChange={e => handleChange('note', e.target.value)} />

            <Box mt={2}>
              <Typography variant="subtitle1">Hồ sơ đã nộp</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên hồ sơ</TableCell>
                    <TableCell>Ngày nộp</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(formData.submittedFiles || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField value={item.name} onChange={(e) => {
                          const updated = [...formData.submittedFiles];
                          updated[index].name = e.target.value;
                          setFormData({ ...formData, submittedFiles: updated });
                        }} fullWidth />
                      </TableCell>
                      <TableCell>
                        <TextField type="date" value={item.date} onChange={(e) => {
                          const updated = [...formData.submittedFiles];
                          updated[index].date = e.target.value;
                          setFormData({ ...formData, submittedFiles: updated });
                        }} fullWidth InputLabelProps={{ shrink: true }} />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          const updated = [...formData.submittedFiles];
                          updated.splice(index, 1);
                          setFormData({ ...formData, submittedFiles: updated });
                        }}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={1}>
                <Button variant="outlined" onClick={() => setFormData(prev => ({
                  ...prev,
                  submittedFiles: [...(prev.submittedFiles || []), { name: '', date: '' }]
                }))}>+ Thêm hồ sơ</Button>
              </Box>
            </Box>
          </>
        )}

        {progressType === 'salary' && (
          <>
            <TextField label="Ngày tăng lương" type="date" fullWidth InputLabelProps={{ shrink: true }} margin="normal" value={formData.date || ''} onChange={e => handleChange('date', e.target.value)} />
            <TextField label="Lần thứ" fullWidth margin="normal" value={formData.times || ''} onChange={e => handleChange('times', e.target.value)} />
            <TextField label="Lý do" fullWidth margin="normal" value={formData.reason || ''} onChange={e => handleChange('reason', e.target.value)} />
            <TextField label="Bậc" fullWidth margin="normal" value={formData.level || ''} onChange={e => handleChange('level', e.target.value)} />
            <TextField label="Ghi chú" fullWidth margin="normal" value={formData.note || ''} onChange={e => handleChange('note', e.target.value)} />
          </>
        )}

        {progressType === 'promotion' && (
          <>
            <TextField label="Ngày thăng chức" type="date" fullWidth InputLabelProps={{ shrink: true }} margin="normal" value={formData.date || ''} onChange={e => handleChange('date', e.target.value)} />
            <TextField label="Lần thứ" fullWidth margin="normal" value={formData.times || ''} onChange={e => handleChange('times', e.target.value)} />
            <TextField label="Lý do" fullWidth margin="normal" value={formData.reason || ''} onChange={e => handleChange('reason', e.target.value)} />
            <TextField label="Chức vụ cũ" fullWidth margin="normal" value={formData.oldPosition || ''} onChange={e => handleChange('oldPosition', e.target.value)} />
            <TextField label="Chức vụ mới" fullWidth margin="normal" value={formData.newPosition || ''} onChange={e => handleChange('newPosition', e.target.value)} />
            <TextField label="Ghi chú" fullWidth margin="normal" value={formData.note || ''} onChange={e => handleChange('note', e.target.value)} />
          </>
        )}

        {progressType === 'proposal' && (
          <>
            <TextField label="Ngày diễn biến" type="date" fullWidth InputLabelProps={{ shrink: true }} margin="normal" value={formData.date || ''} onChange={e => handleChange('date', e.target.value)} />
            <TextField label="Nội dung" fullWidth margin="normal" value={formData.content || ''} onChange={e => handleChange('content', e.target.value)} />
            <TextField label="Ghi chú" fullWidth margin="normal" value={formData.note || ''} onChange={e => handleChange('note', e.target.value)} />
            <TextField label="Loại" fullWidth margin="normal" value={formData.proposalType || ''} onChange={e => handleChange('proposalType', e.target.value)} />
            <TextField label="Mô tả chi tiết" fullWidth margin="normal" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} />
          </>
        )}

        {['register', 'salary', 'promotion', 'proposal'].includes(progressType) && renderHistoryTable()}

        <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={onClose}>Hủy</Button>
            <Button variant="contained" onClick={handleSave}>
                Lưu
            </Button>
        </Box>
      </DialogContent>
    </Dialog>
    <ViewProgressTemplateDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        progressType={progressType}
        data={selectedRow}
        dataEmployee={dataEmployee}
    />
    </> 
  );
};

export default UpdateProcessDialog;