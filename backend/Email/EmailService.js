import { sendEmail } from './Email.js';
import User from '../User/User.js';
export const sendOtpEmail = async (email, otp) => {
    const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Recovery OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        color: #4A90E2;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .content {
                        margin-top: 20px;
                        font-size: 16px;
                        color: #333333;
                    }
                    .otp-code {
                        margin: 20px 0;
                        padding: 15px;
                        background: #4A90E2;
                        color: white;
                        font-size: 28px;
                        text-align: center;
                        border-radius: 8px;
                        letter-spacing: 2px;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 14px;
                        color: #888888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">LMS-2025: Password recovery</div>
                    <div class="content">
                    Hello,<br><br>
                    You have requested to recover your password. Here is your OTP code:
                    <div class="otp-code">${otp}</div>
                    You will have to verify otp and change password. OTP will expire after <strong>5 minute</strong>.
                    <br><br>
                     If you did not make this request, please ignore this email.
                    </div>
                    <div class="footer">
                        © 2025 LMS. All rights reserved.
                    </div>
                </div>
            </body>
            </html>`;
    await sendEmail(email, '[LMS-2025] Password recovery OTP code', html);
};

export const sendPasswordResetEmail = async (email) => {
    const html = `<p>Your password has been reset successfully.</p>`;
    await sendEmail(email, '[LMS-2025] Password Reset Confirmation', html);
};


export const sendOTPEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: "[LMS-2025] Password recovery OTP code",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Recovery OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        color: #4A90E2;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .content {
                        margin-top: 20px;
                        font-size: 16px;
                        color: #333333;
                    }
                    .otp-code {
                        margin: 20px 0;
                        padding: 15px;
                        background: #4A90E2;
                        color: white;
                        font-size: 28px;
                        text-align: center;
                        border-radius: 8px;
                        letter-spacing: 2px;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 14px;
                        color: #888888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">LMS-2025: Password recovery</div>
                    <div class="content">
                    Hello,<br><br>
                    You have requested to recover your password
                    <div class="otp-code">Password recovery successfully</div>
                    <br><br>
                    </div>
                    <div class="footer">
                        © 2025 LMS. All rights reserved.
                    </div>
                </div>
            </body>
            </html>`,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Lỗi gửi OTP:", error);
        throw new Error("Không thể gửi email.");
    }
};


