import { sendOtpEmail } from './EmailService.js';

export const sendOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP.', error: error.message });
    }
};



