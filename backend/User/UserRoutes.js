import express from 'express';
import { createUserController, getAllUsersController, getUserByIdController, updateUserController, deleteUserController, saveAllUsersController, updatePassword, isEmailUserController, updateRole } from './UserController.js';
import { authenticateUser, authorizeRoles } from '../MiddleWare/AuthMiddleware.js';
const router = express.Router();

// Định nghĩa các route cho User
router.post('/update-role/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin'), updateRole);
router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin'), createUserController);
router.get('/', authenticateUser, authorizeRoles('Admin', 'Superadmin'), getAllUsersController);
router.get('/:id', getUserByIdController);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin'), deleteUserController);
router.post('/import', authenticateUser, authorizeRoles('Admin', 'Superadmin'), saveAllUsersController);
router.patch('/update-password', updatePassword);
router.put('/:id', authenticateUser, updateUserController);
router.post('/is-email-user', isEmailUserController);

export default router;