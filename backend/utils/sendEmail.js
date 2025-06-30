// utils/sendEmail.js

const nodemailer = require("nodemailer");


const sendPasswordByEmail = async (email, password) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS || "Anhvy1590@@", // Mật khẩu ứng dụng hoặc mật khẩu email
      },
    });

    // 2. Cấu hình nội dung email
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email, // Gửi đến email của người dùng mới
      subject: "Chào mừng! Đây là mật khẩu đăng nhập của bạn",
      html: `
        <h1>Chào mừng bạn đã đến với dịch vụ của chúng tôi!</h1>
        <p>Tài khoản của bạn đã được tạo thành công thông qua đăng nhập với Google.</p>
        <p>Bạn có thể sử dụng mật khẩu dưới đây để đăng nhập vào tài khoản theo cách thông thường:</p>
        <h2 style="color: blue; letter-spacing: 2px;">${password}</h2>
        <p><b>Lưu ý quan trọng:</b> Vì lý do bảo mật, bạn nên đổi mật khẩu này ngay sau lần đăng nhập đầu tiên.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ phát triển.</p>
      `,
    };

    // 3. Gửi mail
    await transporter.sendMail(mailOptions);
    console.log("Password email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending password email:", error);
    
  }
};

module.exports = sendPasswordByEmail;