import Enrollment from "./Enrollment.js";
import Course from "../Course/Course.js";
export const createEnrollment = async (userId, courseId) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const isFree = course.price === 0;

        const enrollment = new Enrollment({
            user: userId,
            course: courseId,
            status: isFree ? 'APPROVED' : 'PENDING',
            statusHistory: [{ status: isFree ? 'APPROVED' : 'PENDING' }]
        });

        await enrollment.save();
        return enrollment;
    } catch (error) {
        console.error("Error in createEnrollment:", error);
        throw error;
    }
};

export const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
    try {
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) throw new Error("Enrollment not found");

        enrollment.status = newStatus;
        enrollment.statusHistory.push({ status: newStatus });
        enrollment.updatedAt = new Date();

        await enrollment.save();
        return enrollment;
    } catch (error) {
        console.error("Error in updateEnrollmentStatus:", error);
        throw error;
    }
};

export const getEnrollmentByUser = async (userId) => {
    try {
        return await Enrollment.find({ user: userId }).populate('course');
    } catch (error) {
        console.error("Error in getEnrollmentByUserAndCourse:", error);
        throw error;
    }
};

export const getEnrollmentById = async (enrollmentId) => {
    try {
        return await Enrollment.findById(enrollmentId).populate("user course");
    } catch (error) {
        console.error("Error in getEnrollmentById:", error);
        throw error;
    }
};

