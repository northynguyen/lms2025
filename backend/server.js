import express from 'express';
import { config, connectDB } from './Config/MongoDB.js';
import roleRoutes from './Role/RoleRoutes.js';
import cors from 'cors';
import userRoutes from './User/UserRoutes.js';
import { register, login } from './Auth/AuthController.js';
import emailRoutes from './Email/EmailRoute.js';
import otpRoutes from './Otp/OtpRoute.js';
import TopicRoute from './Topic/TopicRoute.js';
import TagRoute from './Tag/TagRoute.js';
import CourseRoute from './Course/CourseRoute.js';
import SectionRoute from './Course/Section/SectionRoute.js';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
connectDB();

// Khởi động server
app.listen(config.port, () => {
    console.log(`Server đang chạy trên cổng ${config.port}`);
});

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Routes
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/topic', TopicRoute);
app.use('/api/tag', TagRoute);
app.use('/api/course', CourseRoute);
app.use('/api/section', SectionRoute);




