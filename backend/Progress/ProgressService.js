import Progress from "./Progress.js";

export const createProgress = async (userId, courseId, enrollmentId, enrollmentDate, deadline) => {
    try {
        const progress = new Progress({
            user: userId,
            course: courseId,
            enrollment: enrollmentId,
            enrollmentDate,
            deadline,
            status: 'ACTIVE',
            completionPercentage: 0,
            sectionsProgress: [],
            materialsProgress: []
        });
        await progress.save();
        return progress;
    } catch (error) {
        console.error("Error in createProgress:", error);
        throw error;
    }
};

export const updateProgress = async (progressId, updateData) => {
    try {
        const updatedProgress = await Progress.findByIdAndUpdate(progressId, updateData, { new: true });
        return updatedProgress;
    } catch (error) {
        console.error("Error in updateProgress:", error);
        throw error;
    }
};

export const getProgressByUserAndCourse = async (userId, courseId) => {
    try {
        return await Progress.findOne({ user: userId, course: courseId })
            .populate("sectionsProgress materialsProgress");
    } catch (error) {
        console.error("Error in getProgressByUserAndCourse:", error);
        throw error;
    }
};

export const completeCourse = async (progressId) => {
    try {
        const progress = await Progress.findById(progressId);
        if (!progress) throw new Error("Progress not found");

        progress.status = "FINISH";
        progress.completionPercentage = 100;
        progress.completionDate = new Date();
        await progress.save();
        return progress;
    } catch (error) {
        console.error("Error in completeCourse:", error);
        throw error;
    }
};

