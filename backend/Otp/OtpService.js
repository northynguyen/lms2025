import Otp from './Otp.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateOtp = () => crypto.randomInt(100000, 999999).toString();

export const saveOtp = async (email) => {
    const otp = generateOtp();
    await Otp.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    return otp;
};

// Xác thực OTP và tạo resetToken
export const verifyOtpAndCreateResetToken = async (email, otp) => {
    try {
        const record = await Otp.findOne({ email, otp });
        if (!record || record.expiresAt < new Date()) return null;
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return resetToken;
    } catch (error) {
        console.error('Error in verifyOtpAndCreateResetToken:', error);
        throw new Error('OTP verification failed.');
    }
};

// Kiểm tra tính hợp lệ của resetToken
export const verifyResetToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null; // Token không hợp lệ
    }
};
