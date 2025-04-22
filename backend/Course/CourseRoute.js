import express from 'express';
import * as courseController from './CourseController.js';
import { authenticateUser, authorizeRoles } from '../MiddleWare/AuthMiddleware.js';
import uploadImage from '../Upload/UploadImage.js';


const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), uploadImage.single('image'), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/search', courseController.handleCourseSearch);
router.get('/:id', courseController.getCourseById);
router.put('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), uploadImage.single('image'), courseController.updateCourse);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Superadmin', "Instructor"), courseController.deleteCourse);

export default router;