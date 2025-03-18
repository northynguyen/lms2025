import express from 'express';
import { createRoleController, getAllRolesController, updateRoleController, deleteRoleController, saveAllRolesController } from './RoleController.js';
import { authenticateUser, authorizeRoles } from '../MiddleWare/AuthMiddleware.js';
const router = express.Router();

// Định nghĩa các route
router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin'), createRoleController);
router.get('/', authenticateUser, authorizeRoles('Admin', 'Superadmin'), getAllRolesController);
router.put('/roles/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin'), updateRoleController);
router.delete('/roles/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin'), deleteRoleController);
router.post('/import', authenticateUser, authorizeRoles('Admin', 'Superadmin'), saveAllRolesController);


export default router;
