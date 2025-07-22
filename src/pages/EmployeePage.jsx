import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  updateEmployeeProfile,
  setEditData,
  setOpenDialog,
  setRegisterDialogOpen,
  setRegisterData,
  setCurrentEmployeeId,
  setViewData
} from '../store/employeeSlice';

import {
  Container, Button, Dialog, DialogTitle, DialogContent
} from '@mui/material';

import EmployeeTable from '../component/EmployeeTable';
import EmployeeForm from '../component/EmployeeForm';
import RegisterProfileDialog from '../component/Dialog/RegisterProfileDialog';
import { toast } from 'react-toastify';

const EmployeePage = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    list: data,
    openDialog,
    editData,
    viewData,
    registerDialogOpen,
    currentEmployeeId,
    registerData
  } = useSelector((state) => state.employee);

  const employeeData = data.find(emp => emp.id === currentEmployeeId);

  useEffect(() => {
    dispatch(fetchEmployees(user));
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(setEditData(null));
    dispatch(setOpenDialog(true));
  };

  const handleEdit = (employee) => {
    if (user.role === 'leader') {
      dispatch(setViewData(employee));
    } else {
      dispatch(setEditData(employee));
      dispatch(setOpenDialog(true));
    }
  };

  const handleView = (employee) => {
    dispatch(setViewData(employee));
  };

  const handleOpenRegisterDialog = (employee) => {
    dispatch(setCurrentEmployeeId(employee.id));
    dispatch(setRegisterDialogOpen(true));
  };

  const handleSubmitRegister = async (formData) => {
    try {
      await dispatch(updateEmployeeProfile({
        id: currentEmployeeId,
        profile: formData.profile,
        application: formData.application
      })).unwrap();

      toast.success("Lưu thông tin hồ sơ thành công!");
      dispatch(fetchEmployees(user));
    } catch (error) {
      toast.error("Có lỗi khi lưu hồ sơ!");
    }
  };

  return (
    <Container>
      <h2>Danh sách nhân viên</h2>

      {user.role !== 'leader' && (
        <Button variant="contained" onClick={handleAdd}>Thêm mới</Button>
      )}

      <EmployeeTable
        employees={data}
        onEdit={handleEdit}
        onView={handleView}
        onSuccess={() => dispatch(fetchEmployees(user))}
      />

      <Dialog open={openDialog} onClose={() => dispatch(setOpenDialog(false))} maxWidth="md" fullWidth>
        <DialogTitle>{editData ? 'Chỉnh sửa' : 'Thêm mới'} Nhân viên</DialogTitle>
        <DialogContent>
          <EmployeeForm
            editData={editData}
            onSuccess={() => dispatch(fetchEmployees(user))}
            onClose={() => dispatch(setOpenDialog(false))}
            onRegisterClick={handleOpenRegisterDialog}
            isViewMode={user.role === 'leader'}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewData} onClose={() => dispatch(setViewData(null))} maxWidth="md" fullWidth>
        <DialogTitle>Xem chi tiết nhân viên</DialogTitle>
        <DialogContent>
          <EmployeeForm
            editData={viewData}
            isViewMode={true}
            onClose={() => dispatch(setViewData(null))}
          />
        </DialogContent>
      </Dialog>

      <RegisterProfileDialog
        open={registerDialogOpen}
        onClose={() => dispatch(setRegisterDialogOpen(false))}
        data={registerData}
        setData={(data) => dispatch(setRegisterData(data))}
        onSubmit={handleSubmitRegister}
        employeeData={employeeData}
      />
    </Container>
  );
};

export default EmployeePage;