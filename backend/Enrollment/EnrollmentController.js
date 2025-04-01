import { createEnrollment, updateEnrollmentStatus, getEnrollmentByUserAndCourse, getEnrollmentById } from "./EnrollmentService.js";

export const createEnrollmentHandler = async (req, res) => {
    try {
        const { userId, courseId } = req.body;
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
        const { userId, courseId } = req.params;
        const enrollment = await getEnrollmentByUserAndCourse(userId, courseId);
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        res.json(enrollment);
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

