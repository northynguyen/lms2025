import { registerUser, loginUser } from './AuthService.js';

// Đăng ký người dùng
export const register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, role } = req.body;

        const { user, token } = await registerUser({ username, password, firstName, lastName, email, role });

        res.status(201).json({ message: 'Sign up successfully.', user, token });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Đăng nhập người dùng
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const { user, token, enrollments } = await loginUser({ username, password });

        res.status(200).json({ message: 'Sign in successfully.', user, token, enrollments });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(401).json({ error: error.message });
    }
};
