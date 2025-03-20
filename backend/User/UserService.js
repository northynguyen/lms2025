import User from './User.js';
import bcrypt from 'bcrypt';
import Otp from '../Otp/Otp.js';
import Role from '../Role/Role.js';
// Lấy tất cả người dùng
export const getAllUsers = async () => await User.find();

// Tìm người dùng theo ID
export const getUserById = async (id) => await User.findById(id);

// Tạo mới người dùng
export const createUser = async (data) => {
    const newUser = new User(data);
    return await newUser.save();
};

// Cập nhật người dùng theo ID
export const updateUser = async (userId, updateData) => {
    try {
        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        if (updateData.role) {
            const existingRole = await Role.findOne({ _id: updateData.role });
            if (!existingRole) {
                throw new Error('Role not found.');
            }
            updateData.role = existingRole._id;
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) throw new Error('Không tìm thấy người dùng.');

        return updatedUser;
    } catch (error) {
        throw new Error(`Lỗi cập nhật người dùng: ${error.message}`);
    }
};

// Xóa người dùng theo ID
export const deleteUser = async (id) => await User.findByIdAndDelete(id);

// Lưu nhiều người dùng vào database
export const saveAllUsers = async (users) => {
    try {
        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('Danh sách người dùng không hợp lệ.');
        }
        return await User.insertMany(users);
    } catch (error) {
        throw new Error(`Lỗi khi lưu nhiều người dùng: ${error.message}`);
    }
};
export const updatePasswordByEmail = async (email, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await deleteOtpByEmail(email);
};
// Xóa OTP sau khi đổi mật khẩu
export const deleteOtpByEmail = async (email) => {
    await Otp.deleteMany({ email });
};

export const isEmailUser = async (email) => {
    const user = await User.findOne({ email: email });
    if (user) {
        return user._id;
    }
};