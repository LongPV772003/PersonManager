import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './ProfileForm.scss';
import noAvatar from '../../assets/avatar.png';

const ProfileForm = forwardRef(({ data, onChange, readOnly = false }, ref) => {
  const currentDate = new Date()
  const [errorFields, setErrorFields] = useState([]);
  const printRef = useRef();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
    if (errorFields.includes(field) && value?.toString().trim() !== '') {
      setErrorFields(prev => prev.filter(f => f !== field));
    }
  };
  
  // Chuyển đổi file thành chuỗi Base64 (base64 encoding) để lưu ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('image', reader.result); 
    };
    if (file) reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    document.getElementById('upload-photo-input')?.click();
  };
  const updateField = (section, index, key, value) => {
    const updated = [...(data[section] || [])];
    updated[index] = { ...updated[index], [key]: value };
    handleChange(section, updated);
  };
  const requiredFields = [
    'name', 'gender', 'commonName', 'dob', 'birthPlace', 'hometown',
    'permanentAddress', 'contactAddress', 'phone', 'email', 'ethnicity', 'religion',
    'familyClass', 'cccd', 'cccdDate', 'cccdPlace',
    'professionalLevel', 'languageLevel', 'itLevel', 'politicalLevel',
    'unionDate', 'partyDate', 'officialPartyDate',
    'currentWorkplace', 'rewards', 'disciplines', 'strengths','address', 'signature'
  ];
  const validate = () => {
    const missing = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
    setErrorFields(missing);
    return missing.length === 0;
  };
  useImperativeHandle(ref, () => ({
    validate: validate
  }));

  return (
    <div className="profile-print" ref={printRef}>
      <div className="title-row">
        <div className="photo-section">
          <img
            src={data.image || noAvatar}
            alt="avatar"
            className="profile-photo"
            onClick={!readOnly ? triggerFileInput : undefined}
            style={{ cursor: !readOnly ? 'pointer' : 'default' }}
          />
          {!readOnly && (
            <input
              id="upload-photo-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          )}
        </div>
        <div className="title-section">
          <div className="title-header">
            <div>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div> Độc lập - tự do - hạnh phúc</div>
            <div className="title-border"></div>
          </div>
          <h2 className="title">SƠ YẾU LÝ LỊCH</h2>
          <p className="subtitle">(Tự thuật)</p>
        </div>
      </div>

      <h3 style={{display: 'flex'}}>I. THÔNG TIN BẢN THÂN <div style={{color: '#888', textTransform: 'lowercase', fontWeight:'lighter', marginLeft:'2px'}}>(Nếu không có ghi không)</div></h3>
      <ol className="info-list">
        <li className="dual">
          1. Họ và tên (chữ in hoa):
          <input className={`long ${errorFields.includes('name') ? 'error' : ''}`} type="text" value={data.name || ''} onChange={e => handleChange('name', e.target.value)} disabled={readOnly} />
          Nam/Nữ:
          <input className={`${errorFields.includes('gender') ? 'error' : ''}`} type="text" value={data.gender || ''} onChange={e => handleChange('gender', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          2. Họ tên thường dùng:
          <input className={`long ${errorFields.includes('commonName') ? 'error' : ''}`} type="text" value={data.commonName || ''} onChange={e => handleChange('commonName', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          3. Ngày sinh:
          <input className={`long ${errorFields.includes('dob') ? 'error' : ''}`} type="date" value={data.dob || ''} onChange={e => handleChange('dob', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          4. Nơi sinh:
          <input className={`long ${errorFields.includes('birthPlace') ? 'error' : ''}`} type="text" value={data.birthPlace || ''} onChange={e => handleChange('birthPlace', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          5. Nguyên quán:
          <input className={`long ${errorFields.includes('hometown') ? 'error' : ''}`} type="text" value={data.hometown || ''} onChange={e => handleChange('hometown', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          6. Nơi đăng ký hộ khẩu thường trú:
          <input className={`long ${errorFields.includes('permanentAddress') ? 'error' : ''}`} type="text" value={data.permanentAddress || ''} onChange={e => handleChange('permanentAddress', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          7. Chỗ ở hiện nay:
          <input className={`long ${errorFields.includes('contactAddress') ? 'error' : ''}`} type="text" value={data.contactAddress || ''} onChange={e => handleChange('contactAddress', e.target.value)} disabled={readOnly} />
        </li>

        <li className="dual">
          8. Điện thoại liên hệ:
          <input className={`${errorFields.includes('phone') ? 'error' : ''}`} type="text" value={data.phone || ''} onChange={e => handleChange('phone', e.target.value)} disabled={readOnly} />
          Email:
          <input className={`long ${errorFields.includes('email') ? 'error' : ''}`} type="text" value={data.email || ''} onChange={e => handleChange('email', e.target.value)} disabled={readOnly} />
        </li>

        <li className="dual">
          9. Dân tộc:
          <input className={`long ${errorFields.includes('ethnicity') ? 'error' : ''}`} type="text" value={data.ethnicity || ''} onChange={e => handleChange('ethnicity', e.target.value)} disabled={readOnly} />
          Tôn giáo:
          <input className={`long ${errorFields.includes('religion') ? 'error' : ''}`} type="text" value={data.religion || ''} onChange={e => handleChange('religion', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          10. Thành phần gia đình:
          <input className={`long ${errorFields.includes('familyClass') ? 'error' : ''}`} type="text" value={data.familyClass || ''} onChange={e => handleChange('familyClass', e.target.value)} disabled={readOnly} />
        </li>

        <li className="triple">
          11. Số CMND/CCCD:
          <input className={`long ${errorFields.includes('cccd') ? 'error' : ''}`} type="text" value={data.cccd || ''} onChange={e => handleChange('cccd', e.target.value)} disabled={readOnly} />
          Cấp ngày:
          <input className={`long ${errorFields.includes('cccdDate') ? 'error' : ''}`} type="date" value={data.cccdDate || ''} onChange={e => handleChange('cccdDate', e.target.value)} disabled={readOnly} />
          Nơi cấp:
          <input className={`long ${errorFields.includes('cccdPlace') ? 'error' : ''}`} type="text" value={data.cccdPlace || ''} onChange={e => handleChange('cccdPlace', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          12. Trình độ chuyên môn:
          <input className={`long ${errorFields.includes('professionalLevel') ? 'error' : ''}`} type="text" value={data.professionalLevel || ''} onChange={e => handleChange('professionalLevel', e.target.value)} disabled={readOnly} />
        </li>

        <li className="dual">
          13. Trình độ ngoại ngữ:
          <input type="text" className={`long ${errorFields.includes('languageLevel') ? 'error' : ''}`} value={data.languageLevel || ''} onChange={e => handleChange('languageLevel', e.target.value)} disabled={readOnly} />
          Tin học:
          <input type="text" className={`long ${errorFields.includes('itLevel') ? 'error' : ''}`} value={data.itLevel || ''} onChange={e => handleChange('itLevel', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          14. Trình độ lý luận chính trị:
          <input className={`long ${errorFields.includes('politicalLevel') ? 'error' : ''}`} type="text" value={data.politicalLevel || ''} onChange={e => handleChange('politicalLevel', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          15. Ngày vào Đoàn TNCS HCM:
          <input type="date" className={`long ${errorFields.includes('unionDate') ? 'error' : ''}`} value={data.unionDate || ''} onChange={e => handleChange('unionDate', e.target.value)} disabled={readOnly} />
        </li>

        <li className="dual">
          16. Ngày vào Đảng CSVN:
          <input type="date" className={`long ${errorFields.includes('partyDate') ? 'error' : ''}`} value={data.partyDate || ''} onChange={e => handleChange('partyDate', e.target.value)} disabled={readOnly} />
          Chính thức:
          <input type="date" className={`long ${errorFields.includes('officialPartyDate') ? 'error' : ''}`} value={data.officialPartyDate || ''} onChange={e => handleChange('officialPartyDate', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          17. Cơ quan công tác hiện nay (nếu có):
          <input className={`long ${errorFields.includes('currentWorkplace') ? 'error' : ''}`} type="text" value={data.currentWorkplace || ''} onChange={e => handleChange('currentWorkplace', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          18. Khen thưởng:
          <input className={`long ${errorFields.includes('rewards') ? 'error' : ''}`} type="text" value={data.rewards || ''} onChange={e => handleChange('rewards', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          19. Kỷ luật:
          <input className={`long ${errorFields.includes('disciplines') ? 'error' : ''}`} type="text" value={data.disciplines || ''} onChange={e => handleChange('disciplines', e.target.value)} disabled={readOnly} />
        </li>

        <li>
          20. Sở trường:
          <input className={`long ${errorFields.includes('strengths') ? 'error' : ''}`} type="text" value={data.strengths || ''} onChange={e => handleChange('strengths', e.target.value)} disabled={readOnly} />
        </li>
      </ol>

      <h3>II. QUAN HỆ GIA ĐÌNH</h3>
      <table className="table-family">
        <thead>
          <tr>
            <th>Quan hệ</th>
            <th>Họ và tên</th>
            <th>Giới tính</th>
            <th>Năm sinh</th>
            <th>Nghề nghiệp</th>
            <th>Nơi công tác</th>
          </tr>
        </thead>
        <tbody>
          {(data.families || []).map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  className={errorFields.includes(`families.${index}.relation`) ? 'error' : ''}
                  value={item.relation}
                  onChange={e => updateField('families', index, 'relation', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`families.${index}.name`) ? 'error' : ''}
                  value={item.name}
                  onChange={e => updateField('families', index, 'name', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`families.${index}.gender`) ? 'error' : ''}
                  value={item.gender}
                  onChange={e => updateField('families', index, 'gender', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`families.${index}.dob`) ? 'error' : ''}
                  value={item.dob}
                  onChange={e => updateField('families', index, 'dob', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`families.${index}.job`) ? 'error' : ''}
                  value={item.job}
                  onChange={e => updateField('families', index, 'job', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`families.${index}.address`) ? 'error' : ''}
                  value={item.address}
                  onChange={e => updateField('families', index, 'address', e.target.value)}
                  disabled={readOnly}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>III. QUÁ TRÌNH ĐÀO TẠO, BỒI DƯỠNG</h3>
      {!readOnly && (
        <button type="button" onClick={() =>
          handleChange('trainingHistory', [...(data.trainingHistory || []), { fromTo: '', school: '', major: '', form: '', certificate: '' }])
        }>
          + Thêm dòng (Đào tạo)
        </button>
      )}
      <table className="table-training">
        <thead>
          <tr>
            <th>Từ tháng năm đến tháng năm</th>
            <th>Tên trường hoặc cơ sở đào tạo</th>
            <th>Ngành học</th>
            <th>Hình thức đào tạo</th>
            <th>Văn bằng, chứng chỉ</th>
          </tr>
        </thead>
        <tbody>
          {(data.trainingHistory || []).map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  className={errorFields.includes(`trainingHistory.${index}.fromTo`) ? 'error' : ''}
                  value={item.fromTo}
                  onChange={e => updateField('trainingHistory', index, 'fromTo', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`trainingHistory.${index}.school`) ? 'error' : ''}
                  value={item.school}
                  onChange={e => updateField('trainingHistory', index, 'school', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`trainingHistory.${index}.major`) ? 'error' : ''}
                  value={item.major}
                  onChange={e => updateField('trainingHistory', index, 'major', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`trainingHistory.${index}.form`) ? 'error' : ''}
                  value={item.form}
                  onChange={e => updateField('trainingHistory', index, 'form', e.target.value)}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  className={errorFields.includes(`trainingHistory.${index}.certificate`) ? 'error' : ''}
                  value={item.certificate}
                  onChange={e => updateField('trainingHistory', index, 'certificate', e.target.value)}
                  disabled={readOnly}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        <h3>IV. QUÁ TRÌNH CÔNG TÁC</h3>
        {!readOnly && (
          <button type="button" onClick={() =>
            handleChange('workHistory', [...(data.workHistory || []), { fromTo: '', unit: '', position: '' }])
          }>
            + Thêm dòng (Công tác)
          </button>
        )}
        <table className="table-work">
          <thead>
            <tr>
              <th>Từ tháng năm đến tháng năm</th>
              <th>Đơn vị công tác</th>
              <th>Chức vụ</th>
            </tr>
          </thead>
          <tbody>
            {(data.workHistory || []).map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    className={errorFields.includes(`workHistory.${index}.fromTo`) ? 'error' : ''}
                    value={item.fromTo}
                    onChange={e => updateField('workHistory', index, 'fromTo', e.target.value)}
                    disabled={readOnly}
                  />
                </td>
                <td>
                  <input
                    className={errorFields.includes(`workHistory.${index}.unit`) ? 'error' : ''}
                    value={item.unit}
                    onChange={e => updateField('workHistory', index, 'unit', e.target.value)}
                    disabled={readOnly}
                  />
                </td>
                <td>
                  <input
                    className={errorFields.includes(`workHistory.${index}.position`) ? 'error' : ''}
                    value={item.position}
                    onChange={e => updateField('workHistory', index, 'position', e.target.value)}
                    disabled={readOnly}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="commit-section">
          <p>
            Tôi xin cam đoan bản khai sơ yếu lý lịch trên trung thực, nếu có điều gì không đúng tôi chịu trách nhiệm trước pháp luật và kỷ luật của đơn vị.
          </p>
          <div className="sign-row">
            <div className="sign-left">
              Xác nhận của cơ quan đang công tác<br />hoặc địa phương nơi đăng ký hộ khẩu
            </div>
            <div className="sign-right">
              <div className="location-date">
                <input
                  type="text"
                  className={`address-input ${errorFields.includes('address') ? 'error' : ''}`}
                  value={data.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={readOnly}
                />, ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
              </div>
              Người khai<br />
              <i>(ký và ghi rõ họ tên)</i><br />
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
    </div>
  );
});

export default ProfileForm;
