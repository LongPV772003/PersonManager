import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Stack, Chip,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { deleteEmployee } from '../store/employeeSlice';
import PaginationTableWrapper from './Panigation/PaginationTableWrapper';

const EmployeeTable = ({ onEdit, onView, employees, onSuccess }) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const dispatch = useDispatch();

const handleDelete = async (id) => {
  if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      toast.success("Xoá thành công!");
      onSuccess();
    } catch (err) {
      toast.error("Xoá thất bại!");
      console.error(err);
    }
  }
};
  const getStatusColor = (status) => {
    switch (status) {
      case 'Lưu mới':
        return 'info';
      case 'Chờ duyệt kết thúc':
      case 'Từ chối':
        return 'error';
      case 'Yêu cầu bổ sung':
        return 'warning';
      case 'Chờ duyệt tăng lương':
      case 'Chờ duyệt thăng chức':
      case 'Chờ duyệt đề xuất/tham mưu':
      case 'Chờ xử lý':
      case 'Chờ duyệt':
        return 'secondary';
      case 'Đã duyệt':
        return 'success';
      default:
        return 'default';
    }
  };
  const getCustomStyle = (status) => {
    switch (status) {
      case 'Đã nộp lưu':
        return {
          backgroundColor: '#02abd1ff',
          color: '#fff',
          border: 'none'
        };
      case 'Kết thúc':
        return {
          backgroundColor: '#d11302ff',
          color: '#fff',
          border: 'none'
        };
      default:
        return {};
    }
  };

  return (
  <PaginationTableWrapper
    data={employees}
    rowsPerPage={4}
    renderTable={(pagedEmployees) => (
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#66cc66' }}>
            <TableRow>
              <TableCell><strong>Tên</strong></TableCell>
              <TableCell><strong>Giới tính</strong></TableCell>
              <TableCell><strong>Team</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell align="right"><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedEmployees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.gender}</TableCell>
                <TableCell>{emp.team}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={emp.status}
                      color={getStatusColor(emp.status)}
                      sx={{ ...getCustomStyle(emp.status) }}
                      size="small"
                    />
                    {/* lý do từ chối hoặc bổ sung */}
                    {(emp.status === 'Từ chối' && emp.rejectReason) && (
                      <Box mt={0.5} sx={{ fontSize: '0.75rem', color: 'red' }}>{emp.rejectReason}</Box>
                    )}
                    {(emp.status === 'Yêu cầu bổ sung' && emp.requirementContent) && (
                      <Box mt={0.5} sx={{ fontSize: '0.75rem', color: '#ed6c02' }}>{emp.requirementContent}</Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {user.role === "manager" &&
                      ['Lưu mới', 'Yêu cầu bổ sung', 'Từ chối'].includes(emp.status) && (
                        <Tooltip title="Chỉnh sửa">
                          <IconButton color="info" onClick={() => onEdit(emp)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                    <Tooltip title="Xem">
                      <IconButton onClick={() => onView(emp)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {user.role === "manager" && emp.status === 'Lưu mới' && (
                      <Tooltip title="Xóa">
                        <IconButton color="error" onClick={() => handleDelete(emp.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  />
)};

export default EmployeeTable;
