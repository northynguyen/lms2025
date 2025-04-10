import { createEnrollment, updateEnrollmentStatus, getEnrollmentByUser, getEnrollmentById } from "./EnrollmentService.js";

export const createEnrollmentHandler = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;
        const enrollment = await createEnrollment(userId, courseId);
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEnrollmentStatusHandler = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { newStatus } = req.body;
        const updatedEnrollment = await updateEnrollmentStatus(enrollmentId, newStatus);
        res.json(updatedEnrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrollmentHandler = async (req, res) => {
    try {
        const enrollments = await getEnrollmentByUser(req.user._id);
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrollmentByIdHandler = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const enrollment = await getEnrollmentById(enrollmentId);
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

