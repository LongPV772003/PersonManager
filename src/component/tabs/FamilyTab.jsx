import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Grid, TextField, IconButton, Button, MenuItem } from '@mui/material';
import { Delete } from '@mui/icons-material';

const FamilyTab = forwardRef(({ data, onChange, readOnly = false }, ref) => {
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState([]);

  const validateField = (field, value) => {
    if (!value || value.trim() === '') return 'Trường này là bắt buộc';

    if (field === 'cccd') {
      if (!/^\d{9,12}$/.test(value)) return 'CCCD không hợp lệ (phải từ 9 đến 12 số)';
    }

    if (field === 'dob') {
      const dob = new Date(value);
      const today = new Date();
      if (isNaN(dob.getTime())) return 'Ngày sinh không hợp lệ';
      if (dob > today) return 'Ngày sinh không được ở tương lai';
      const age = today.getFullYear() - dob.getFullYear();
      if (age > 120) return 'Ngày sinh không hợp lý (quá già)';
    }

    const onlyLettersRegex = /^[A-Za-zÀ-ỹ\s]+$/u;
    const isMeaninglessName = (str) => /^([a-zA-ZÀ-ỹ])\1{2,}$/u.test(str.trim());
    if (['name', 'gender', 'relation', 'job'].includes(field)) {
      if (value.trim().length < 2) return 'Trường này quá ngắn';
      if (!onlyLettersRegex.test(value)) return 'Chỉ được nhập chữ, không chứa số hoặc ký tự đặc biệt';
      if (isMeaninglessName(value)) return 'Nội dung không hợp lệ';
    }

    return '';
  };

  const validateAll = (showErrors = false) => {
    const newErrors = data.families.map(f => ({
      name: validateField('name', f.name),
      gender: validateField('gender', f.gender),
      dob: validateField('dob', f.dob),
      job: validateField('job', f.job),
      relation: validateField('relation', f.relation),
      address: validateField('address', f.address),
    }));

    if (showErrors) setErrors(newErrors);
    return newErrors.every(group => Object.values(group).every(v => v === ''));
  };

  useImperativeHandle(ref, () => ({
    validate: (show = true) => validateAll(show)
  }));

  const handleChange = (index, field, value) => {
    const newList = [...data.families];
    newList[index][field] = value;
    onChange({ ...data, families: newList });

    const newTouched = [...touched];
    if (!newTouched[index]) newTouched[index] = {};
    newTouched[index][field] = true;
    setTouched(newTouched);

    const error = validateField(field, value);
    const newErrors = [...errors];
    if (!newErrors[index]) newErrors[index] = {};
    newErrors[index][field] = error;
    setErrors(newErrors);
  };

  const handleAdd = () => {
    const newList = [...data.families, {
      name: '', gender: '', dob: '', job: '', relation: '', address: ''
    }];
    onChange({ ...data, families: newList });
    setErrors([...errors, {}]);
    setTouched([...touched, {}]);
  };

  const handleDelete = (index) => {
    const newList = data.families.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    const newTouched = touched.filter((_, i) => i !== index);
    onChange({ ...data, families: newList });
    setErrors(newErrors);
    setTouched(newTouched);
  };

  return (
    <>
      {data.families.map((item, index) => (
        <Grid container spacing={2} key={index} alignItems="center" mb={2}>
          <Grid item xs={2}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Họ tên"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              error={touched[index]?.name && !!errors[index]?.name}
              helperText={touched[index]?.name ? errors[index]?.name : ''}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              select
              disabled={readOnly}
              fullWidth
              label="Giới tính"
              value={item.gender || "Chọn"}
              onChange={(e) => handleChange(index, 'gender', e.target.value)}
              error={touched[index]?.gender && !!errors[index]?.gender}
              helperText={touched[index]?.gender ? errors[index]?.gender : ''}
            >
              <MenuItem value="Chọn">-- Chọn --</MenuItem>
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Ngày sinh"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={item.dob}
              onChange={(e) => handleChange(index, 'dob', e.target.value)}
              error={touched[index]?.dob && !!errors[index]?.dob}
              helperText={touched[index]?.dob ? errors[index]?.dob : ''}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Nghề nghiệp"
              value={item.job}
              onChange={(e) => handleChange(index, 'job', e.target.value)}
              error={touched[index]?.job && !!errors[index]?.job}
              helperText={touched[index]?.job ? errors[index]?.job : ''}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Mối quan hệ"
              value={item.relation}
              onChange={(e) => handleChange(index, 'relation', e.target.value)}
              error={touched[index]?.relation && !!errors[index]?.relation}
              helperText={touched[index]?.relation ? errors[index]?.relation : ''}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Địa chỉ"
              value={item.address}
              onChange={(e) => handleChange(index, 'address', e.target.value)}
              error={touched[index]?.address && !!errors[index]?.address}
              helperText={touched[index]?.address ? errors[index]?.address : ''}
            />
          </Grid>
          {!readOnly && (
            <Grid item xs={1}>
              <IconButton onClick={() => handleDelete(index)}>
                <Delete />
              </IconButton>
            </Grid>
          )}
        </Grid>
      ))}
      {!readOnly && (
        <Button onClick={handleAdd} sx={{ mt: 2 }}>
          Thêm thành viên
        </Button>
      )}
    </>
  );
});

export default FamilyTab;
