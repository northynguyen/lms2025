import Enrollment from "./Enrollment.js";

export const createEnrollment = async (userId, courseId) => {
    try {
        const enrollment = new Enrollment({
            user: userId,
            course: courseId,
            status: "PENDING",
            statusHistory: [{ status: "PENDING" }]
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

export const getEnrollmentByUserAndCourse = async (userId, courseId) => {
    try {
        return await Enrollment.findOne({ user: userId, course: courseId })
            .populate("user course");
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

