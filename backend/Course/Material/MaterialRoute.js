import express from 'express';
import * as materialController from './MaterialController.js';
import { authenticateUser, authorizeRoles } from '../../MiddleWare/AuthMiddleware.js';
import { uploadMaterial } from '../../Upload/UploadMaterial.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), uploadMaterial, materialController.createMaterial);
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterialById);
router.put('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), uploadMaterial, materialController.updateMaterial);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), materialController.deleteMaterial);
router.get("/user/:userId", materialController.getMaterialsByUser);
router.get("/course/:courseId", materialController.getMaterialsByCourse);

export default router;