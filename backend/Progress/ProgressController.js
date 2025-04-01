import { createProgress, updateProgress, getProgressByUserAndCourse, completeCourse } from "./ProgressService.js";

const createProgressHandler = async (req, res) => {
    try {
        const { userId, courseId, enrollmentId, enrollmentDate, deadline } = req.body;
        const progress = await createProgress(userId, courseId, enrollmentId, enrollmentDate, deadline);
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProgressHandler = async (req, res) => {
    try {
        const { progressId } = req.params;
        const updateData = req.body;
        const updatedProgress = await updateProgress(progressId, updateData);
        res.json(updatedProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProgressHandler = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const progress = await getProgressByUserAndCourse(userId, courseId);
        if (!progress) return res.status(404).json({ message: "Progress not found" });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const completeCourseHandler = async (req, res) => {
    try {
        const { progressId } = req.params;
        const progress = await completeCourse(progressId);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createProgressHandler, updateProgressHandler, getProgressHandler, completeCourseHandler };
