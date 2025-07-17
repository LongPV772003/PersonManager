import './ApplicationForm.scss';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';

const rules = {
  company: { required: true },
  fullName: { required: true },
  dob: { required: true },
  address: { required: true },
  phone: { required: true, pattern: /^\d{9,11}$/, message: 'Số điện thoại không hợp lệ' },
  position: { required: true },
  graduationType: { required: true },
  graduationSchool: { required: true },
  internCompany: { required: true },
  skills: { required: true },
  location: { required: true },
  signature: { required: true }
};

const ApplicationForm = forwardRef(({ data, onChange, readOnly = false }, ref) => {
  const [errorFields, setErrorFields] = useState([]);
  const currentDate = new Date();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
    setErrorFields((prev) => prev.filter((f) => f !== field));
  };

  const validateAll = () => {
    const invalidFields = [];

    for (const key in rules) {
      const value = data[key]?.trim?.() || '';
      const rule = rules[key];

      if (rule.required && !value) {
        invalidFields.push(key);
        continue;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        invalidFields.push(key);
        continue;
      }
    }

    setErrorFields(invalidFields);

    if (invalidFields.length > 0) {
      toast.error('Vui lòng điền đầy đủ và chính xác thông tin trong form');
      return false;
    }

    return true;
  };

  useImperativeHandle(ref, () => ({
    validate: validateAll
  }));

  const renderInput = (field, className = '', type = 'text') => (
    <input
      type={type}
      className={`${className} ${errorFields.includes(field) ? 'input-error' : ''}`}
      value={data[field] || ''}
      onChange={(e) => handleChange(field, e.target.value)}
      disabled={readOnly}
    />
  );

  return (
    <div className="application-print">
      <div className="title-block center">
        <div className="header-line">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div className="header-line"><b>Độc lập - Tự do - Hạnh phúc</b></div>
        <div className="separator"></div>
        <div className="main-title">ĐƠN ĐĂNG KÝ XIN VIỆC</div>
      </div>

      <div className="application-body">
        <div className="text-body input-line">
          <span>Kính gửi: Ban lãnh đạo cùng phòng nhân sự Công ty</span>
          {renderInput('company')}
        </div>

        <div className="text-body input-line">
          <span>Tôi tên là:</span>
          {renderInput('fullName')}
        </div>

        <div className="text-body input-line">
          <span>Sinh ngày:</span>
          {renderInput('dob', '', 'date')}
        </div>

        <div className="text-body input-line">
          <span>Chỗ ở hiện nay:</span>
          {renderInput('address', 'long')}
        </div>

        <div className="text-body input-line">
          <span>Số điện thoại liên hệ:</span>
          {renderInput('phone')}
        </div>

        <div className="text-body">
          Thông qua trang website của công ty, tôi biết được Quý công ty có nhu cầu tuyển dụng vị trí&nbsp;
          {renderInput('position')}.
          Tôi cảm thấy trình độ và kỹ năng của mình phù hợp với vị trí này. Tôi mong muốn được làm việc và cống hiến cho công ty.
        </div>

        <div className="text-body input-line">
          <span>Tôi đã tốt nghiệp loại</span>
          {renderInput('graduationType', 'input-small')}
          <span>tại trường</span>
          {renderInput('graduationSchool')}
        </div>

        <div className="text-body input-line">
          <span>Tôi đã từng tham gia thực tập tại công ty <span style={{ color: '#888' }}>(Ghi không nếu chưa có)</span></span>
          {renderInput('internCompany')}
        </div>

        <div className="text-body input-line">
          <span>Trong quá trình học tập và làm việc tại đó tôi đã được trang bị kỹ năng như</span>
          {renderInput('skills')}
        </div>

        <div className="text-body">
          Tôi thực sự mong muốn được làm việc trong môi trường chuyên nghiệp của Quý công ty. Tôi rất mong nhận được lịch hẹn phỏng vấn trong một ngày gần nhất.
        </div>

        <div className="text-body">Tôi xin chân thành cảm ơn!</div>

        <div className="sign-row">
          <div className="location-date">
            {renderInput('location', 'address-input')}, ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
          </div>
          <strong>Người viết đơn</strong>
          <i>(ký và ghi rõ họ tên)</i>
          {!readOnly ? (
            renderInput('signature', 'signature-input')
          ) : (
            <div className="signature-value">{data.signature}</div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ApplicationForm;
