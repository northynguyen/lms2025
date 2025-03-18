import express from 'express';
import * as sectionController from './SectionController.js';
import { authenticateUser, authorizeRoles } from '../../MiddleWare/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), sectionController.createSection);
router.get('/', sectionController.getAllSections);
router.get('/:id', sectionController.getSectionById);
router.put('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), sectionController.updateSection);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), sectionController.deleteSection);

export default router;