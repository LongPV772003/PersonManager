import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Tab, Box, Button, Stack } from '@mui/material';
import EmployeeInfoTab from './tabs/EmployeeInfoTab';
import DegreeTab from './tabs/DegreeTab';
import FamilyTab from './tabs/FamilyTab';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createEmployee, updateEmployee } from '../store/employeeSlice';

const EmployeeForm = ({ editData, onClose, isViewMode = false, onRegisterClick, onSuccess }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [canRegister, setCanRegister] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))

  const [employee, setEmployee] = useState(editData || {
    name: '', code: '', gender: '', dob: '', address: '', team: '', image: '', cccd: '', phone: '', email: '',
    degrees: [], families: [], status: 'Lưu mới'
  });

  const infoRef = useRef();
  const degreeRef = useRef();
  const familyRef = useRef();

  useEffect(() => {
    if (editData) {
      setEmployee(editData);
    } else {
      setEmployee({
        name: '', code: '', gender: '', dob: '', address: '', team: '', image: '', cccd: '', phone: '', email: '',
        degrees: [], families: [], status: 'Lưu mới'
      });
    }
  }, [editData]);

  useEffect(() => {
    if (!isViewMode) {
      const infoValid = infoRef.current?.validate?.(false) ?? true;
      const degreeValid = degreeRef.current?.validate?.(false) ?? true;
      const familyValid = familyRef.current?.validate?.(false) ?? true;
      setCanRegister(infoValid && degreeValid && familyValid);
    }
  }, [employee]);

  const handleValidateAllTabs = () => {
    const infoValid = infoRef.current?.validate?.(true) ?? true;
    const degreeValid = degreeRef.current?.validate?.(true) ?? true;
    const familyValid = familyRef.current?.validate?.(true) ?? true;

    if (!infoValid) {
      setTabIndex(0);
      toast.error("Thông tin nhân viên không hợp lệ");
      return false;
    }

    if (!degreeValid) {
      setTabIndex(1);
      toast.error("Thông tin văn bằng không hợp lệ");
      return false;
    }

    if (!familyValid) {
      setTabIndex(2);
      toast.error("Thông tin gia đình không hợp lệ");
      return false;
    }

    return true;
  };

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!handleValidateAllTabs()) return;

    try {
      if (editData) {
        await dispatch(updateEmployee(employee)).unwrap();
        toast.success('Cập nhật nhân viên thành công');
      } else {
        await dispatch(createEmployee(employee)).unwrap();
        toast.success('Thêm nhân viên thành công');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu nhân viên');
      console.error(error);
    }
  };
  const handleSubmitRegister = async () => {
    if (!handleValidateAllTabs()) return;

    try {
      let savedEmployee = employee;

      if (editData) {
        await dispatch(updateEmployee(employee)).unwrap();
      } else {
        const res = await dispatch(createEmployee(employee)).unwrap();
        savedEmployee = res;
      }

      if (onRegisterClick) onRegisterClick(savedEmployee);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký');
      console.error(error);
    }
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
        <Tab label="Thông tin nhân viên" />
        <Tab label="Văn bằng" />
        <Tab label="Quan hệ gia đình" />
      </Tabs>

      <Box mt={2}>
        <Box hidden={tabIndex !== 0}>
          <EmployeeInfoTab ref={infoRef} data={employee} onChange={setEmployee} readOnly={isViewMode} />
        </Box>
        <Box hidden={tabIndex !== 1}>
          <DegreeTab ref={degreeRef} data={employee} onChange={setEmployee} readOnly={isViewMode} />
        </Box>
        <Box hidden={tabIndex !== 2}>
          <FamilyTab ref={familyRef} data={employee} onChange={setEmployee} readOnly={isViewMode} />
        </Box>
      </Box>

      {!isViewMode && (
        <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>{editData ? "Cập nhật" : "Lưu"}</Button>
          <Button disabled={!canRegister} variant="contained" color="success" onClick={handleSubmitRegister}>
            Đăng ký
          </Button>
        </Stack>
      )}

      {isViewMode && (
        <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
          <Button variant="contained" onClick={onClose}>Đóng</Button>
        </Stack>
      )}
    </Box>
  );
};

export default EmployeeForm;