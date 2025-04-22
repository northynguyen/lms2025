import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../User/User.js';

dotenv.config();

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) throw new Error('Token not found.');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('role');
        if (!user) throw new Error('User invalid.');
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed: ' + error.message });
    }
};
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) throw new Error('User not authenticated.');
            if (!allowedRoles.includes(req.user.role.name)) {
                throw new Error('Unauthorized access.');
            }
            req.createdBy = req.user._id;
            next();
        } catch (error) {
            res.status(403).json({ error: 'Authorization failed: ' + error.message });
        }
    };
};