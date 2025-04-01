import express from 'express';
import {
    startStudyingController,
    completeStudyController,
    calculateCourseCompletionController
} from './StudyLogController.js';
import { authenticateUser } from '../MiddleWare/AuthMiddleware.js';
const router = express.Router();

router.post('/start', authenticateUser, startStudyingController);
router.post('/complete', authenticateUser, completeStudyController);
router.get('/completion/:userId/:courseId', calculateCourseCompletionController);

export default router;
