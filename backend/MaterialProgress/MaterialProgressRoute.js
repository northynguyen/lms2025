import express from 'express';
import { updateMaterialProgressController, getMaterialProgressController } from './MaterialProgressController.js';
import { authenticateUser } from '../MiddleWare/AuthMiddleware.js';

const router = express.Router();

router.post('/update', authenticateUser, updateMaterialProgressController);
router.get('/:userId/:materialId', authenticateUser, getMaterialProgressController);

export default router;
