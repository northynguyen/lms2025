import { saveOtp, verifyOtpAndCreateResetToken } from './OtpService.js';
import { sendOtpEmail } from '../Email/EmailService.js';

export const requestOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const otp = await saveOtp(email);
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error generating OTP.', error: error.message });
    }
};

export const checkOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const resetToken = await verifyOtpAndCreateResetToken(email, otp);
        if (!resetToken) return res.status(400).json({ error: 'OTP invalid or expired.' });
        res.status(200).json({ message: 'OTP verified successfully.', resetToken });
    } catch (error) {
        res.status(500).json({ error: 'Error verifying OTP.' });
    }
};
