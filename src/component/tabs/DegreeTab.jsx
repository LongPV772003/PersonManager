import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Grid, TextField, IconButton, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

const DegreeTab = forwardRef(({ data, onChange, readOnly = false }, ref) => {
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState([]);

  const validateField = (field, value) => {
    const isMeaninglessName = (str) =>
      /^([a-zA-ZÀ-ỹ])\1{2,}$/u.test(str.trim());
    if (!value || value.trim() === '') return 'Trường này là bắt buộc';

    const onlyLettersRegex = /^[A-Za-zÀ-ỹ\s]+$/u;

    if (field === 'date') {
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
      if (date > new Date()) return 'Ngày cấp không được lớn hơn hiện tại';
    }

    if (['name', 'content', 'field'].includes(field)) {
      if (value.trim().length < 2) return 'Trường này quá ngắn';
      if (isMeaninglessName(value)) return 'Nội dung không hợp lệ';
    }

    return '';
  };

  const validateAll = (showErrors = false) => {
    const newErrors = data.degrees.map((d) => ({
      name: validateField('name', d.name),
      date: validateField('date', d.date),
      content: validateField('content', d.content),
      field: validateField('field', d.field),
    }));

    if (showErrors) setErrors(newErrors);
    return newErrors.every((group) =>
      Object.values(group).every((val) => val === '')
    );
  };

  useImperativeHandle(ref, () => ({
    validate: (show = true) => validateAll(show),
  }));

  const handleChange = (index, field, value) => {
    const newDegrees = [...data.degrees];
    newDegrees[index][field] = value;
    onChange({ ...data, degrees: newDegrees });

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
    const newDegrees = [
      ...data.degrees,
      { name: '', date: '', content: '', field: '' },
    ];
    onChange({ ...data, degrees: newDegrees });
    setErrors([...errors, {}]);
    setTouched([...touched, {}]);
  };

  const handleDelete = (index) => {
    const newDegrees = data.degrees.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    const newTouched = touched.filter((_, i) => i !== index);
    onChange({ ...data, degrees: newDegrees });
    setErrors(newErrors);
    setTouched(newTouched);
  };

  return (
    <>
      {data.degrees.map((item, index) => (
        <Grid container spacing={2} key={index} alignItems="center" mb={3}>
          <Grid item xs={3}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Tên văn bằng"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              error={touched[index]?.name && !!errors[index]?.name}
              helperText={touched[index]?.name ? errors[index]?.name : ''}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Ngày cấp"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={item.date}
              onChange={(e) => handleChange(index, 'date', e.target.value)}
              error={touched[index]?.date && !!errors[index]?.date}
              helperText={touched[index]?.date ? errors[index]?.date : ''}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Nội dung"
              value={item.content}
              onChange={(e) => handleChange(index, 'content', e.target.value)}
              error={touched[index]?.content && !!errors[index]?.content}
              helperText={touched[index]?.content ? errors[index]?.content : ''}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              disabled={readOnly}
              fullWidth
              label="Lĩnh vực"
              value={item.field}
              onChange={(e) => handleChange(index, 'field', e.target.value)}
              error={touched[index]?.field && !!errors[index]?.field}
              helperText={touched[index]?.field ? errors[index]?.field : ''}
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
          Thêm văn bằng
        </Button>
      )}
    </>
  );
});

export default DegreeTab;