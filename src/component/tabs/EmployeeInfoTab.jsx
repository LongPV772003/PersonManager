import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';

const EmployeeInfoTab = forwardRef(({ data, onChange, readOnly = false }, ref) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

 const validateField = (name, value) => {
  const isEmpty = !value || value.toString().trim() === '';

  const onlyLettersRegex = /^[A-Za-zÀ-ỹ\s]+$/u;

  const isMeaninglessName = (str) => {
    return /^([a-zA-ZÀ-ỹ])\1{2,}$/u.test(str.trim());
  };

  switch (name) {
    case 'name':
    case 'code':
    case 'gender':
    case 'dob':
    case 'address':
    case 'team':
    case 'cccd':
    case 'email':
    case 'phone':
      if (isEmpty) return 'Trường này bắt buộc';
      break;
  }

  switch (name) {
    case 'name':
    case 'gender':
    case 'team':
      if (!onlyLettersRegex.test(value)) return 'Chỉ được nhập chữ, không chứa số hoặc ký tự đặc biệt';
      break;
  }

  if (name === 'name') {
    if (value.trim().length < 2) return 'Tên quá ngắn';
    if (isMeaninglessName(value)) return 'Tên không hợp lệ';
  }

  if (name === 'email') {
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Email không hợp lệ';
  }

  if (name === 'phone') {
    if (!/^\d{9,11}$/.test(value)) return 'Số điện thoại không hợp lệ';
  }

  if (name === 'cccd') {
    if (!/^\d{12}$/.test(value)) return 'CCCD phải gồm 12 số';
  }

  if (name === 'dob') {
    const dobDate = new Date(value);
    const today = new Date();
    if (isNaN(dobDate.getTime())) return 'Ngày sinh không hợp lệ';
    if (dobDate > today) return 'Ngày sinh không được ở tương lai';

    const age = today.getFullYear() - dobDate.getFullYear();
    if (age < 16) return 'Nhân viên phải từ 16 tuổi trở lên';
    if (age > 100) return 'Tuổi vượt quá giới hạn cho phép';
  }

  return '';
};

  const validate = (showErrors = false) => {
    const newErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (showErrors) setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    validate: (showErrors = true) => validate(showErrors)
  }));


  const handleChange = (e) => {
    const { name, value } = e.target;

    setTouched(prev => ({ ...prev, [name]: true }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    onChange({ ...data, [name]: value });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Tên nhân viên"
          name="name"
          value={data.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Mã nhân viên"
          name="code"
          value={data.code}
          onChange={handleChange}
          error={!!errors.code}
          helperText={errors.code}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          disabled={readOnly}
          fullWidth
          label="Giới tính"
          name="gender"
          value={data.gender || 'Chọn'}
          onChange={handleChange}
          error={!!errors.gender}
          helperText={errors.gender}
        >
          <MenuItem value="Chọn">-- Chọn --</MenuItem>
          <MenuItem value="Nam">Nam</MenuItem>
          <MenuItem value="Nữ">Nữ</MenuItem>
          <MenuItem value="Khác">Khác</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Ngày sinh"
          name="dob"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={data.dob}
          onChange={handleChange}
          error={!!errors.dob}
          helperText={errors.dob}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Địa chỉ"
          name="address"
          value={data.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Team"
          name="team"
          value={data.team}
          onChange={handleChange}
          error={!!errors.team}
          helperText={errors.team}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Số CCCD"
          name="cccd"
          value={data.cccd}
          onChange={handleChange}
          error={!!errors.cccd}
          helperText={errors.cccd}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Số điện thoại"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled={readOnly}
          fullWidth
          label="Email"
          name="email"
          value={data.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
    </Grid>
  );
});

export default EmployeeInfoTab;
