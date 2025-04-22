import * as courseService from './CourseService.js';

export const createCourse = async (req, res) => {
    try {
        const courseData = { ...req.body, createdBy: req.createdBy };
        const course = await courseService.createCourse(courseData, req.file);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses(req.query);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        const courseData = course.toObject();
        courseData.discountedPrice = course.getDiscountedPrice();
        res.status(200).json(courseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.createdBy };
        const updatedCourse = await courseService.updateCourse(req.params.id, updateData, req.file);
        if (!updatedCourse) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await courseService.deleteCourse(req.params.id);
        if (!deletedCourse) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const handleCourseSearch = async (req, res) => {
    try {
        const { query, level = 'All', page = 1, limit = 10 } = req.query;
        const result = await courseService.searchCourses(query, level, parseInt(page), parseInt(limit));
        res.json(result);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};