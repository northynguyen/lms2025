import express from 'express';
import { createTagHandler, getAllTagsHandler, getTagByIdHandler, updateTagHandler, deleteTagHandler, importTagHandler } from './TagController.js';
import { authenticateUser, authorizeRoles } from '../MiddleWare/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), createTagHandler);
router.get('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), getAllTagsHandler);
router.get('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), getTagByIdHandler);
router.put('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), updateTagHandler);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), deleteTagHandler);
router.post('/import', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), importTagHandler);

export default router;