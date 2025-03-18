// TopicRoute.js
import express from 'express';
import * as TopicController from './TopicController.js';
import { authenticateUser, authorizeRoles } from '../MiddleWare/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), TopicController.createTopic);
router.post('/import', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), TopicController.createMultipleTopics);
router.get('/', authenticateUser, TopicController.getAllTopics);
router.get('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), TopicController.getTopicById);
router.put('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), TopicController.updateTopic);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), TopicController.deleteTopic);

export default router;