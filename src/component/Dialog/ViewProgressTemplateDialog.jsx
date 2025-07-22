import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import noAvatar from '../../assets/avatar.png';

const ViewProgressTemplateDialog = ({ open, onClose, progressType, data, dataEmployee }) => {
  const [tab, setTab] = useState(0);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} tháng ${currentDate.getMonth() + 1} năm ${currentDate.getFullYear()}`;
 const getProgressLabel = () => {
    switch (progressType) {
      case 'salary': return 'Quyết định tăng lương';
      case 'promotion': return 'Quyết định thăng chức';
      case 'proposal': return 'Biểu mẫu đề xuất / tham mưu';
      default: return 'Biểu mẫu diễn biến';
    }
  };

  const renderProgressContent = () => {
    if (!data) return null;

    switch (progressType) {
      case 'salary': {
        const p = dataEmployee?.profileRecords || {};
        return (
          <Box
            fontFamily="'Times New Roman', serif"
            px={6}
            py={4}
            lineHeight={1.8}
            sx={{ width: '220mm', minHeight: '197mm', mx: 'auto' }}
            border="1px solid #ccc" borderRadius={2}
            >
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Box width="50%">
                <Typography fontWeight="bold" textTransform="uppercase">CÔNG TY OCEANTEACH ACADEMY</Typography>
                <Typography>Số: 34/2025-QĐ-TL</Typography>
                </Box>
                <Box width="50%" textAlign="center">
                <Typography fontWeight="bold" textTransform="uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                <Typography>Độc lập – Tự do – Hạnh phúc</Typography>
                <Box sx={{ mt: 1, borderBottom: '1px dotted black', width: '60%', mx: 'auto' }} />
                </Box>
            </Box>

            <Typography align="right" mb={2}>Hà Nội, ngày {formattedDate}</Typography>

            <Typography align="center" fontWeight="bold" textTransform="uppercase">Quyết định</Typography>
            <Typography align="center" mb={2}>Về việc tăng lương cho Nhân viên</Typography>

            <Box>
                <Typography>- Căn cứ vào quy chế lương thưởng và Điều lệ hoạt động của công ty OCEANTEACH ACADEMY.</Typography>
                <Typography>- Căn cứ hợp đồng lao động 14/HĐLĐ, ngày 01 tháng 01 năm 2021.</Typography>
                <Typography>- Căn cứ những đóng góp thực tế của Ông/Bà {p.name} đối với sự phát triển của Công ty.</Typography>
                <Typography>- Xét đề nghị của trưởng phòng hành chính nhân sự.</Typography>
            </Box>

            <Typography align="center" mt={4} fontWeight="bold">GIÁM ĐỐC CÔNG TY OCEANTEACH ACADEMY</Typography>
            <Typography align="center" fontWeight="bold" textTransform="uppercase" mt={1}>QUYẾT ĐỊNH</Typography>

            <Box mt={3}>
                <Typography><strong>Điều 1:</strong> Tăng lương cho nhân viên: <strong>{p.name}</strong></Typography>
                <Typography>
                - Mức lương chính của nhân viên {p.name} đang thỏa thuận tại hợp đồng lao động 34/HĐLĐ, ngày 01 tháng 07 năm 2025 là: <strong>13.000.000 vnđ</strong> (Bằng chữ: Mười ba triệu đồng).
                </Typography>
                <Typography>
                - Điều chỉnh mức lương chính nhân viên {p.name}, sẽ được tăng thêm: <strong>2.000.000 vnđ</strong> (Bằng chữ: Hai triệu đồng).
                </Typography>
                <Typography>
                - Kể từ ngày <strong>{data.date}</strong>, mức lương chính của Ông/Bà {p.name} sẽ là: <strong>15.000.000 vnđ</strong> (Bằng chữ: Mười lăm triệu đồng).
                </Typography>
            </Box>

            <Typography mt={2}><strong>Điều 2:</strong> Các phòng ban liên quan và Ông/Bà {p.name} căn cứ quyết định thi hành.</Typography>

            <Box display="flex" justifyContent="space-between" mt={5}>
                <Box>
                <Typography fontWeight="bold">Nơi nhận:</Typography>
                <Typography>- TỔNG GIÁM ĐỐC</Typography>
                <Typography>- Như Điều 2</Typography>
                <Typography>- Lưu: HS, HC</Typography>
                </Box>
                <Box textAlign="center">
                <Typography fontWeight="bold">GIÁM ĐỐC</Typography>
                <Typography>(Ký tên, đóng dấu)</Typography>
                <Typography sx={{mt: 2}}><i>Trần Văn A</i></Typography>
                </Box>
            </Box>
        </Box>
        );
      }

    case 'promotion': {
        const p = dataEmployee || {};
        return (
          <Box
            fontFamily="'Times New Roman', serif"
            px={6}
            py={4}
            lineHeight={1.8}
            sx={{ width: '220mm', minHeight: '197mm', mx: 'auto', fontSize: '15px' }}
            border="1px solid #ccc" borderRadius={2}
            >
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Box width="50%">
                <Typography fontWeight="bold" textTransform="uppercase">TÊN CQ, TC CHỦ QUẢN</Typography>
                <Typography fontWeight="bold" textTransform="uppercase">TÊN CƠ QUAN, TỔ CHỨC</Typography>
                <Typography>Số: 14/QDTC</Typography>
                </Box>
                <Box width="50%" textAlign="center">
                <Typography fontWeight="bold" textTransform="uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                <Typography>Độc lập – Tự do – Hạnh phúc</Typography>
                <Box sx={{ mt: 1, borderBottom: '1px solid black', width: '60px', mx: 'auto' }} />
                </Box>
            </Box>

            <Typography align="right" mt={2}>Hà Nội, ngày {formattedDate}</Typography>

            <Typography align="center" fontWeight="bold" textTransform="uppercase" mt={3}>THÔNG BÁO</Typography>
            <Typography align="center" mb={2}>
                Về việc thăng chức nhân sự giữ vị trí <strong>{data.newPosition}</strong>
            </Typography>

            <Typography>
                Nhằm ghi nhận những đóng góp xuất sắc trong thời gian qua và đảm bảo cơ cấu tổ chức phù hợp với định hướng phát triển của <strong>Công ty OCEANTECH Academy</strong>, Ban lãnh đạo quyết định bổ nhiệm/thăng chức nhân sự như sau:
            </Typography>

            <Box mt={3}>
                <Typography fontWeight="bold">1. Thông tin nhân sự được thăng chức</Typography>
                <Typography>Họ và tên: <strong>{p.name}</strong></Typography>
                <Typography>Chức vụ hiện tại: <strong>{data.oldPosition}</strong></Typography>
                <Typography>Chức vụ mới: <strong>{data.newPosition}</strong></Typography>
                <Typography>Thời gian có hiệu lực: <strong>{data.date}</strong></Typography>
                <Typography>Phạm vi và trách nhiệm công việc: {data.note}</Typography>
            </Box>

            <Box mt={3}>
                <Typography fontWeight="bold">2. Nội dung thông báo</Typography>
                <Typography>
                Sau khi xem xét năng lực, thành tích và sự cống hiến của <strong>{p.name}</strong>, Ban lãnh đạo đã quyết định bổ nhiệm/thăng chức nhân sự trên giữ chức vụ <strong>{data.newPosition}</strong> kể từ ngày <strong>{data.date}</strong>.
                </Typography>
                <Typography mt={1}>
                Chúng tôi tin tưởng rằng, với kinh nghiệm và sự tận tâm trong công việc, <strong>{p.name}</strong> sẽ hoàn thành tốt nhiệm vụ được giao, góp phần phát triển bền vững của tổ chức.
                </Typography>
                <Typography mt={1}>
                Đề nghị các đơn vị, cá nhân liên quan tạo điều kiện và phối hợp để <strong>{p.name}</strong> nhanh chóng tiếp nhận nhiệm vụ và phát huy hiệu quả công việc.
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={5}>
                <Box>
                <Typography fontWeight="bold">Nơi nhận:</Typography>
                <Typography>- Phòng hành chính, nhân sự</Typography>
                <Typography>- Công ty OCEANTECH Academy</Typography>
                <Typography>- Lưu: VT, QDTC 34</Typography>
                </Box>
                <Box textAlign="center">
                <Typography fontWeight="bold">QUYỀN HẠN, CHỨC VỤ CỦA NGƯỜI KÝ</Typography>
                <Typography fontStyle="italic">
                    (Chữ ký của người có thẩm quyền, dấu/chữ ký số của cơ quan, tổ chức)
                </Typography>
                <Typography sx={{mt: 2}}><i>Trần Văn A</i></Typography>
                </Box>
            </Box>
            </Box>
        );
      }

     case 'proposal':
      return (
        <Box
          fontFamily="'Times New Roman', serif"
          px={6}
          py={4}
          lineHeight={1.8}
          sx={{ width: '220mm', minHeight: '167mm', mx: 'auto', fontSize: '15px' }}
          border="1px solid #ccc" borderRadius={2} >
          <Box px={3}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box>
                <Typography><strong>Công ty OCEANTECH ACADEMY</strong></Typography>
              </Box>
              <Box textAlign="center">
                <Typography><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></Typography>
                <Typography>Độc lập - Tự do - Hạnh phúc</Typography>
              </Box>
            </Box>

            <Typography align="right" mb={3}>
              {data.location || 'Hà Nội'}, ngày {data.date ? new Date(data.date).getDate() : '__'} tháng {data.date ? new Date(data.date).getMonth() + 1 : '__'} năm {data.date ? new Date(data.date).getFullYear() : '____'}
            </Typography>

            <Typography variant="h6" align="center" fontWeight="bold" gutterBottom textTransform="uppercase">
              ĐƠN ĐỀ XUẤT / THAM MƯU
            </Typography>

            <Typography align="center" mb={3}>
              (V/v: {data.content || '......................................................'})
            </Typography>

            <Typography>Kính gửi: Ban Giám đốc công ty</Typography>

            <Box mt={2}>
              <Typography>
                Tôi là: <strong>{dataEmployee.name|| '............................................'}</strong>
              </Typography>
              <Typography>
                Chức vụ: <strong>{dataEmployee.team || '............................................'}</strong>
              </Typography>
              <Typography mt={2}>
                Nay tôi viết đơn này kính đề xuất / tham mưu: {data.description || '..............................................................'}
              </Typography>
            </Box>

            <Box mt={2}>
              <Typography>
                Lý do đề xuất: <strong>{data.note || '............................................'}</strong>
              </Typography>
              <Typography>
                Loại đề xuất: <strong>{data.proposalType || '............................................'}</strong>
              </Typography>
            </Box>

            <Typography mt={3}>
              Kính mong Ban Giám đốc xem xét và phê duyệt nội dung đề xuất trên. Xin trân trọng cảm ơn!
            </Typography>

            <Box display="flex" justifyContent="space-between" mt={5}>
              <Box>
                <Typography><strong>Nơi nhận:</strong></Typography>
                <Typography>- Như trên</Typography>
              </Box>
              <Box textAlign="center">
                <Typography><strong>TM. NGƯỜI ĐỀ XUẤT</strong></Typography>
                <Typography>(Ký, ghi rõ họ tên)</Typography>
                <Typography sx={{mt: 2 }}><i>{dataEmployee.name}</i></Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      );

      default:
        return <Typography>Không có dữ liệu</Typography>;
    }
  };

  const renderProfileForm = () => {
    const data = dataEmployee?.profileRecords;
    const currentDate = new Date();

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <div className="profile-print">
        <div className="title-row">
            <div className="photo-section">
            <img
                src={data.image || noAvatar}
                alt="avatar"
                className="profile-photo"
            />
            </div>
            <div className="title-section">
            <div className="title-header">
                <div>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div>Độc lập - tự do - hạnh phúc</div>
                <div className="title-border"></div>
            </div>
            <h2 className="title">SƠ YẾU LÝ LỊCH</h2>
            <p className="subtitle">(Tự thuật)</p>
            </div>
        </div>

        <h3>I. THÔNG TIN BẢN THÂN</h3>
        <ol className="info-list">
            <li className="dual">1. Họ và tên (chữ in hoa): <strong>{data.name}</strong> &nbsp; Nam/Nữ: <strong>{data.gender}</strong></li>
            <li>2. Họ tên thường dùng: <strong>{data.commonName}</strong></li>
            <li>3. Ngày sinh: <strong>{formatDate(data.dob)}</strong></li>
            <li>4. Nơi sinh: <strong>{data.birthPlace}</strong></li>
            <li>5. Nguyên quán: <strong>{data.hometown}</strong></li>
            <li>6. Hộ khẩu thường trú: <strong>{data.permanentAddress}</strong></li>
            <li>7. Chỗ ở hiện nay: <strong>{data.contactAddress}</strong></li>
            <li className="dual">8. SĐT: <strong>{data.phone}</strong> &nbsp; Email: <strong>{data.email}</strong></li>
            <li className="dual">9. Dân tộc: <strong>{data.ethnicity}</strong> &nbsp; Tôn giáo: <strong>{data.religion}</strong></li>
            <li>10. Thành phần gia đình: <strong>{data.familyClass}</strong></li>
            <li className="triple">11. Số CCCD: <strong>{data.cccd}</strong> &nbsp; Cấp ngày: <strong>{data.cccdDate}</strong> &nbsp; Nơi cấp: <strong>{data.cccdPlace}</strong></li>
            <li>12. Trình độ chuyên môn: <strong>{data.professionalLevel}</strong></li>
            <li className="dual">13. Trình độ ngoại ngữ: <strong>{data.languageLevel}</strong> &nbsp; Tin học: <strong>{data.itLevel}</strong></li>
            <li>14. Trình độ lý luận chính trị: <strong>{data.politicalLevel}</strong></li>
            <li>15. Ngày vào Đoàn TNCS HCM: <strong>{formatDate(data.unionDate)}</strong></li>
            <li className="dual">16. Ngày vào Đảng: <strong>{formatDate(data.partyDate)}</strong> &nbsp; Chính thức: <strong>{formatDate(data.officialPartyDate)}</strong></li>
            <li>17. Cơ quan công tác hiện nay: <strong>{data.currentWorkplace}</strong></li>
            <li>18. Khen thưởng: <strong>{data.rewards}</strong></li>
            <li>19. Kỷ luật: <strong>{data.disciplines}</strong></li>
            <li>20. Sở trường: <strong>{data.strengths}</strong></li>
        </ol>

        <h3>II. QUAN HỆ GIA ĐÌNH</h3>
        <table className="table-family">
            <thead>
            <tr>
                <th>Quan hệ</th><th>Họ và tên</th><th>Giới tính</th><th>Năm sinh</th><th>Nghề nghiệp</th><th>Nơi công tác</th>
            </tr>
            </thead>
            <tbody>
            {(data.families || []).map((item, i) => (
                <tr key={i}>
                <td>{item.relation}</td>
                <td>{item.name}</td>
                <td>{item.gender}</td>
                <td>{item.dob}</td>
                <td>{item.job}</td>
                <td>{item.address}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <h3>III. QUÁ TRÌNH ĐÀO TẠO, BỒI DƯỠNG</h3>
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
            {(data.trainingHistory || []).map((item, i) => (
                <tr key={i}>
                <td>{item.fromTo}</td>
                <td>{item.school}</td>
                <td>{item.major}</td>
                <td>{item.form}</td>
                <td>{item.certificate}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <h3>IV. QUÁ TRÌNH CÔNG TÁC</h3>
        <table className="table-work">
            <thead>
            <tr>
                <th>Từ tháng năm đến tháng năm</th>
                <th>Đơn vị công tác</th>
                <th>Chức vụ</th>
            </tr>
            </thead>
            <tbody>
            {(data.workHistory || []).map((item, i) => (
                <tr key={i}>
                <td>{item.fromTo}</td>
                <td>{item.unit}</td>
                <td>{item.position}</td>
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
                {data.address}, ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
                </div>
                Người khai<br />
                <i>(Ký và ghi rõ họ tên)</i><br />
                <div className="signature-value">{data.signature}</div>
            </div>
            </div>
        </div>
        </div>
    );
    }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{p: 3}}>
      <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)}>
        <Tab label={getProgressLabel()} />
        {(progressType === "salary" || progressType === "promotion") && <Tab label="Sơ yếu lý lịch" />}
      </Tabs>
      <DialogContent>
        <Box p={1}>
          {tab === 0 ? renderProgressContent() : renderProfileForm()}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProgressTemplateDialog;
