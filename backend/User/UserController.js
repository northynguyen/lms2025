import { getAllUsers, getUserById, createUser, updateUser, deleteUser, saveAllUsers, updatePasswordByEmail, isEmailUser } from './UserService.js';
import { verifyResetToken } from '../Otp/OtpService.js';
// Lấy tất cả người dùng
export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.', error: error.message });
    }
};

// Tìm người dùng theo ID
export const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Users not found.' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user.', error: error.message });
    }
};

// Tạo mới người dùng
export const createUserController = async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user.', error: error.message });
    }
};

// Cập nhật người dùng theo ID
export const updateUserController = async (req, res) => {
    try {
        if (req.body.role && req.user.role !== "superadmin") {
            return res.status(403).json({ message: "You cannot change your role." });
        }
        const updatedUser = await updateUser(req.params.id, req.body);
        if (!updatedUser) return res.status(404).json({ message: 'Users not found.' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user.', error: error.message });
    }
};

// Xóa người dùng theo ID
export const deleteUserController = async (req, res) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'Users not found.' });
        res.status(200).json({ message: 'Users deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.', error: error.message });
    }
};

// Lưu nhiều người dùng vào database
export const saveAllUsersController = async (req, res) => {
    try {
        const users = await saveAllUsers(req.body);
        res.status(201).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error saving users.', error: error.message });
    }
};
export const updatePassword = async (req, res) => {
    try {
        const { tokenReset, newPassword } = req.body;
        const decoded = verifyResetToken(tokenReset);
        if (!decoded) return res.status(400).json({ error: 'Token invalid or expired.' });

        await updatePasswordByEmail(decoded.email, newPassword);

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating password.' });
    }
};

export const isEmailUserController = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await isEmailUser(email);
        if (user) {
            return res.status(200).json({
                exists: true,
                userId: user._id,
                message: 'Email already exists.',
                status: 'success',
            });
        }
        return res.status(200).json({
            exists: false,
            message: 'Email available.',
            status: 'success',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error checking email.',
            status: 'error',
            error: error.message,
        });
    }
};


export const updateRole = async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Role updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


