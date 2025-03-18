import express from 'express';
import * as materialController from './MaterialController.js';
import { authenticateUser, authorizeRoles } from '../../MiddleWare/AuthMiddleware.js';
import uploadMaterial from '../../MiddleWare/UploadMaterial.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), materialController.createCourseMaterial);
router.get('/', authenticateUser, materialController.getAllCourseMaterials);
router.get('/:id', authenticateUser, materialController.getCourseMaterialById);
router.put('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), materialController.updateCourseMaterial);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), materialController.deleteCourseMaterial);

export default router;