import './ApplicationForm.scss';
import React, { useImperativeHandle, forwardRef, useState, useRef } from 'react';

const ApplicationForm = forwardRef(({ data, onChange, readOnly = false }, ref) => {
  const currentDate = new Date();
  const applicationRef = useRef();
  const [errorFields, setErrorFields] = useState([]);

  const requiredFields = [
    'company', 'fullName', 'dob', 'address', 'phone',
    'position', 'graduationType', 'graduationSchool',
    'internCompany', 'skills', 'signature', 'location'
  ];

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });

    if (errorFields.includes(field) && value?.toString().trim() !== '') {
      setErrorFields(prev => prev.filter(f => f !== field));
    }
  };

  const validate = () => {
    const missing = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
    setErrorFields(missing);
    return missing.length === 0;
  };

  useImperativeHandle(ref, () => ({ validate }));

  return (
    <div className="application-print" ref={applicationRef}>
      <div className="title-block center">
        <div className="header-line">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div className="header-line"><b>Độc lập - Tự do - Hạnh phúc</b></div>
        <div className="separator"></div>
        <div className="main-title">ĐƠN ĐĂNG KÝ XIN VIỆC</div>
      </div>

      <div className="application-body">
        <div className="text-body input-line">
          <span>Kính gửi: Ban lãnh đạo cùng phòng nhân sự Công ty</span>
          <input
            type="text"
            value={data.company || ''}
            onChange={e => handleChange('company', e.target.value)}
            className={errorFields.includes('company') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body input-line">
          <span>Tôi tên là:</span>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={e => handleChange('fullName', e.target.value)}
            className={errorFields.includes('fullName') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body input-line">
          <span>Sinh ngày:</span>
          <input
            type="date"
            value={data.dob || ''}
            onChange={e => handleChange('dob', e.target.value)}
            className={errorFields.includes('dob') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body input-line">
          <span>Chỗ ở hiện nay:</span>
          <input
            type="text"
            className={`long ${errorFields.includes('address') ? 'error' : ''}`}
            value={data.address || ''}
            onChange={e => handleChange('address', e.target.value)}
            disabled={readOnly}
          />
        </div>

        <div className="text-body input-line">
          <span>Số điện thoại liên hệ:</span>
          <input
            type="text"
            value={data.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
            className={errorFields.includes('phone') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body">
          Thông qua trang website của công ty, tôi biết được Quý công ty có nhu cầu tuyển dụng vị trí&nbsp;
          <input
            type="text"
            value={data.position || ''}
            onChange={e => handleChange('position', e.target.value)}
            className={errorFields.includes('position') ? 'error' : ''}
            disabled={readOnly}
          />.
        </div>

        <div className="text-body input-line">
          <span>Tôi đã tốt nghiệp loại</span>
          <input
            type="text"
            className={`input-small ${errorFields.includes('graduationType') ? 'error' : ''}`}
            value={data.graduationType || ''}
            onChange={e => handleChange('graduationType', e.target.value)}
            disabled={readOnly}
          />
          <span>tại trường</span>
          <input
            type="text"
            value={data.graduationSchool || ''}
            onChange={e => handleChange('graduationSchool', e.target.value)}
            className={errorFields.includes('graduationSchool') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body input-line">
          <span>Tôi đã từng tham gia thực tập tại công ty</span>
          <input
            type="text"
            value={data.internCompany || ''}
            onChange={e => handleChange('internCompany', e.target.value)}
            className={errorFields.includes('internCompany') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body input-line">
          <span>Trong quá trình học tập và làm việc tại đó tôi đã được trang bị kỹ năng như</span>
          <input
            type="text"
            value={data.skills || ''}
            onChange={e => handleChange('skills', e.target.value)}
            className={errorFields.includes('skills') ? 'error' : ''}
            disabled={readOnly}
          />
        </div>

        <div className="text-body">
          Tôi thực sự mong muốn được làm việc trong môi trường chuyên nghiệp của Quý công ty.
        </div>

        <div className="text-body">Tôi xin chân thành cảm ơn!</div>

        <div className="sign-row">
          <div className="location-date">
            <input
              type="text"
              className={`address-input ${errorFields.includes('location') ? 'error' : ''}`}
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={readOnly}
            />, ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
          </div>
          <strong>Người viết đơn</strong>
          <i>(ký và ghi rõ họ tên)</i>
          {!readOnly && (
            <input
              type="text"
              className={`signature-input ${errorFields.includes('signature') ? 'error' : ''}`}
              placeholder="Họ và tên"
              value={data.signature || ''}
              onChange={(e) => handleChange('signature', e.target.value)}
            />
          )}
          {readOnly && <div className="signature-value">{data.signature}</div>}
        </div>
      </div>
    </div>
  );
});

export default ApplicationForm;
