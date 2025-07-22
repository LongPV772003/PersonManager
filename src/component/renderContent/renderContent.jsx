import { Group, School } from "@mui/icons-material";
import { Chip, Divider, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import noAvatar from '../../assets/avatar.png';

export const renderContent = (selectedTab, employee) => {
    if (!employee) return null;

    switch (selectedTab) {
    case 'leaderComment':
        return(
          <Typography gutterBottom>
            {employee.leaderComment
              ? `${employee.leaderComment.name}: ${employee.leaderComment.content} (${new Date(employee.leaderComment.date).toLocaleString('vi-VN')})`
              : 'Chưa có ý kiến của lãnh đạo'}
          </Typography>
        )
    case 'info':
      return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Thông tin nhân viên
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography gutterBottom><strong>Họ tên:</strong> {employee.name}</Typography>
              <Typography gutterBottom><strong>Email:</strong> {employee.email}</Typography>
              <Typography gutterBottom><strong>Mã NV:</strong> {employee.code}</Typography>
              <Typography gutterBottom><strong>Phòng ban:</strong> {employee.team}</Typography>
              <Typography gutterBottom><strong>Số điện thoại:</strong> {employee.phone}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography gutterBottom><strong>CCCD:</strong> {employee.cccd}</Typography>
              <Typography gutterBottom><strong>Ngày sinh:</strong> {employee.dob}</Typography>
              <Typography gutterBottom><strong>Địa chỉ:</strong> {employee.address}</Typography>
              <Typography gutterBottom>
                <strong>Trạng thái:</strong>{' '}
                <Chip
                  label={employee.status}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              </Typography>
            </Grid>
          </Grid>
          {employee.degrees?.length > 0 && (
            <Paper elevation={1} sx={{ mt: 4, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <School sx={{ verticalAlign: 'middle', mr: 1 }} />
                Bằng cấp
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Tên</strong></TableCell>
                    <TableCell><strong>Chuyên ngành</strong></TableCell>
                    <TableCell><strong>Nội dung</strong></TableCell>
                    <TableCell align="center"><strong>Ngày cấp</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employee.degrees.map((deg, i) => (
                    <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <TableCell>{deg.name}</TableCell>
                      <TableCell>{deg.field}</TableCell>
                      <TableCell>{deg.content}</TableCell>
                      <TableCell align="center">{deg.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
          {employee.families?.length > 0 && (
            <Paper elevation={1} sx={{ mt: 4, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Group sx={{ verticalAlign: 'middle', mr: 1 }} />
                Gia đình
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Họ tên</strong></TableCell>
                    <TableCell align="center"><strong>Giới tính</strong></TableCell>
                    <TableCell align="center"><strong>Ngày sinh</strong></TableCell>
                    <TableCell align="center"><strong>Quan hệ</strong></TableCell>
                    <TableCell><strong>CCCD</strong></TableCell>
                    <TableCell><strong>Nghề nghiệp</strong></TableCell>
                    <TableCell><strong>Địa chỉ</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employee.families.map((f, i) => (
                    <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <TableCell>{f.name}</TableCell>
                      <TableCell align="center">{f.gender}</TableCell>
                      <TableCell align="center">{f.dob}</TableCell>
                      <TableCell align="center">{f.relation}</TableCell>
                      <TableCell>{f.cccd}</TableCell>
                      <TableCell>{f.job}</TableCell>
                      <TableCell>{f.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Paper>
      );

      case 'profile': {
        const data = employee.profileRecords;
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
      case 'application':
        const app = employee.applicationRecords || {};
        const currentDate = new Date();
        return (
          <div className="application-print">
            <div className="title-block center">
              <div className="header-line">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="header-line">Độc lập - Tự do - Hạnh phúc</div>
              <div className="separator"></div>
              <div className="main-title">ĐƠN ĐĂNG KÝ XIN VIỆC</div>
            </div>

            <div className="application-body">
              <div className="text-body">
                Kính gửi: Ban lãnh đạo cùng phòng nhân sự Công ty {app.company}
              </div>

              <div className="text-body">
                Tôi tên là: {app.fullName}
              </div>

              <div className="text-body">
                Sinh ngày: {app.dob}
              </div>

              <div className="text-body">
                Chỗ ở hiện nay: {app.address}
              </div>

              <div className="text-body">
                Số điện thoại liên hệ: {app.phone}
              </div>

              <div className="text-body">
                Thông qua trang website của công ty, tôi biết được Quý công ty có nhu cầu tuyển dụng vị trí {app.position}.
                Tôi cảm thấy trình độ và kỹ năng của mình phù hợp với vị trí này. Tôi mong muốn được làm việc và cống hiến cho công ty.
              </div>

              <div className="text-body">
                Tôi đã tốt nghiệp loại {app.graduationType} tại trường {app.graduationSchool}.
              </div>

              <div className="text-body">
                Bên cạnh đó tôi đã tham gia khóa học thực hành tại công ty {app.internCompany}.
              </div>

              <div className="text-body">
                Trong quá trình học tập và làm việc tại đó tôi đã được trang bị kỹ năng như {app.skills}.
              </div>

              <div className="text-body">
                Tôi thực sự mong muốn được làm việc trong môi trường chuyên nghiệp của Quý công ty. Tôi rất mong nhận được lịch hẹn phỏng vấn trong một ngày gần nhất.
              </div>

              <div className="text-body">
                Tôi xin chân thành cảm ơn!
              </div>

              <div className="sign-row">
                <div className="location-date">
                  {app.location}, ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
                </div>
                <strong>Người viết đơn</strong>
                <i>(ký và ghi rõ họ tên)</i>
                <div className="signature-value">{app.signature}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };