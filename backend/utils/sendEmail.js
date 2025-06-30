// utils/sendEmail.js

const nodemailer = require("nodemailer");

/**
 * Gửi mật khẩu qua email cho người dùng mới
 * @param {string} email Email của người dùng
 * @param {string} password Mật khẩu ngẫu nhiên chưa được hash
 */
const sendPasswordByEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Cấu hình nội dung email
    const mailOptions = {
      from: `"FIFA WORLD CUP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Chào mừng! Đây là mật khẩu đăng nhập của bạn",
      html: `
        <h1>Chào mừng bạn đã đến với dịch vụ của chúng tôi!</h1>
        <p>Tài khoản của bạn đã được tạo thành công thông qua đăng nhập với Google.</p>
        <p>Bạn có thể sử dụng mật khẩu dưới đây để đăng nhập vào tài khoản theo cách thông thường:</p>
        <h2 style="color: blue; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px;">${password}</h2>
        <p><b>Lưu ý quan trọng:</b> Vì lý do bảo mật, bạn nên đổi mật khẩu này ngay sau lần đăng nhập đầu tiên.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ phát triển.</p>
      `,
    };

    // 3. Gửi mail và chờ kết quả
    await transporter.sendMail(mailOptions);
    console.log("Password email sent successfully to:", email);
  } catch (error) {
    // Ghi lại lỗi chi tiết để dễ dàng gỡ rối
    console.error("Error sending password email:", error);
    // Bạn có thể throw lỗi ở đây nếu muốn xử lý ở nơi gọi hàm
    // throw new Error("Could not send password email.");
  }
};

module.exports = sendPasswordByEmail;
