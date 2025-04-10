// src/services/authService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../User/User.js';
import Role from '../Role/Role.js';
import Enrollment from '../Enrollment/Enrollment.js';

dotenv.config();
const allowedRoles = ["Student", "Instructor"];
// Tạo JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Đăng ký người dùng mới
export const registerUser = async ({ username, password, firstName, lastName, email, role }) => {
    // Kiểm tra user hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new Error('Username or Email already exists.');


    const existingRole = await Role.findOne({ name: role });
    if (!existingRole || !allowedRoles.includes(existingRole.name)) {
        throw new Error("Role invalid.");
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        role: existingRole._id, // Lưu role dưới dạng ObjectId
    });

    // Tạo token
    const token = generateToken(newUser);

    // Chuẩn bị dữ liệu trả về với role dạng name
    const userWithRoleName = {
        id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: existingRole.name, // Trả về role dạng string
        is2faEnabled: newUser.is2faEnabled,
        isLocked: newUser.isLocked,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };

    return { user: userWithRoleName, token };
};


// Đăng nhập người dùng
export const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username }).populate('role');

    if (!user) throw new Error('User not found.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Password incorrect.');

    // Chuyển đổi role từ object thành name
    const userWithRoleName = {
        ...user.toObject(),
        role: user.role?.name,
    };

    // Tạo token
    const token = generateToken(userWithRoleName);
    const enrollments = await Enrollment.find({ user: user._id }).populate('course');

    return { user: userWithRoleName, token, enrollments };
};
