"use strict";

const transporter = require("../configs/email.config");

class EmailService {
  static sendProjectInvitation = async (
    recipientEmail,
    projectData,
    inviterName
  ) => {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || "Project Manager"}" <${
          process.env.EMAIL_USER
        }>`,
        to: recipientEmail,
        subject: `Mời tham gia dự án: ${projectData.title}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Lời mời tham gia dự án</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Lời mời tham gia dự án</h1>
                </div>
                <div class="content">
                  <p>Xin chào,</p>
                  <p><strong>${inviterName}</strong> đã mời bạn tham gia dự án <strong>"${
          projectData.title
        }"</strong>.</p>
                  
                  <h3>Thông tin dự án:</h3>
                  <ul>
                    <li><strong>Tên dự án:</strong> ${projectData.title}</li>
                    <li><strong>Mô tả:</strong> ${
                      projectData.description || "Không có mô tả"
                    }</li>
                    <li><strong>Người tạo:</strong> ${inviterName}</li>
                    <li><strong>Ngày tạo:</strong> ${new Date(
                      projectData.createdAt
                    ).toLocaleDateString("vi-VN")}</li>
                  </ul>
    
                  <p>Để tham gia dự án, bạn cần:</p>
                  <ol>
                    <li>Đăng ký tài khoản (nếu chưa có)</li>
                    <li>Sử dụng email này để đăng ký: <strong>${recipientEmail}</strong></li>
                    <li>Sau khi đăng ký, bạn sẽ tự động được thêm vào dự án</li>
                  </ol>
    
                  <a href="${
                    process.env.NODE_ENV === "production"
                      ? process.env.FRONTEND_URL
                      : process.env.FRONTEND_URL_DEV
                  }/register?email=${recipientEmail}&project=${
          projectData._id
        }" class="button">
                    Đăng ký và tham gia dự án
                  </a>
    
                  <p>Nếu bạn đã có tài khoản, vui lòng đăng nhập để tham gia dự án.</p>
                  
                  <a href="${
                    process.env.FRONTEND_URL || "http://localhost:3000"
                  }/login" class="button" style="background: #28a745;">
                    Đăng nhập
                  </a>
                </div>
                <div class="footer">
                  <p>Email này được gửi tự động từ hệ thống quản lý dự án.</p>
                  <p>Nếu bạn không mong muốn nhận email này, vui lòng bỏ qua.</p>
                </div>
              </div>
            </body>
            </html>
            `,
        text: `
            Lời mời tham gia dự án
            
            Xin chào,
            
            ${inviterName} đã mời bạn tham gia dự án "${projectData.title}".
            
            Thông tin dự án:
            - Tên dự án: ${projectData.title}
            - Mô tả: ${projectData.description || "Không có mô tả"}
            - Người tạo: ${inviterName}
            - Ngày tạo: ${new Date(projectData.createdAt).toLocaleDateString(
              "vi-VN"
            )}
            
            Để tham gia dự án, bạn cần đăng ký tài khoản với email: ${recipientEmail}
            
            Link đăng ký: ${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/register?email=${recipientEmail}&project=${projectData._id}
            Link đăng nhập: ${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/login
            
            Trân trọng,
            Hệ thống quản lý dự án
            `,
      };

      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
        email: recipientEmail,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
}

module.exports = EmailService;
