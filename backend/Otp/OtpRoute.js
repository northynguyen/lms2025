import express from 'express';
import { requestOtp, checkOtp } from './OtpController.js';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', checkOtp);

export default router;
