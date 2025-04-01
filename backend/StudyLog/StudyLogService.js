import StudyLog from './StudyLog.js';
import CourseMaterial from '../Course/Material/Material.js';

// Bắt đầu học tài liệu
export async function startStudying(userId, courseId, sectionId, materialId) {
    try {
        let studyLog = await StudyLog.findOne({ user: userId, material: materialId });

        if (!studyLog) {
            studyLog = new StudyLog({
                user: userId,
                course: courseId,
                section: sectionId,
                material: materialId,
                accessCount: 1,
                totalTimeSpent: 0, // Đảm bảo không undefined
            });
        } else {
            studyLog.accessCount += 1;
        }

        studyLog.startTime = new Date();
        await studyLog.save();
        return studyLog;
    } catch (error) {
        console.error("Error in startStudying:", error);
        throw error;
    }
}

// Hoàn thành tài liệu
export async function completeStudy(userId, materialId) {
    try {
        let studyLog = await StudyLog.findOne({ user: userId, material: materialId });

        if (studyLog) {
            studyLog.endTime = new Date();
            studyLog.completed = true;
            studyLog.progress = 100;

            const timeSpent = (studyLog.endTime - studyLog.startTime) / 1000; // Chuyển sang giây
            studyLog.totalTimeSpent = (studyLog.totalTimeSpent || 0) + timeSpent; // Đảm bảo không undefined

            await studyLog.save();
        }
        return studyLog;
    } catch (error) {
        console.error("Error in completeStudy:", error);
        throw error;
    }
}

// Tính toán % hoàn thành khóa học
export async function calculateCourseCompletion(userId, courseId) {
    try {
        const totalMaterials = await CourseMaterial.countDocuments({ course: courseId });

        if (totalMaterials === 0) return 0; // Tránh phép chia không cần thiết

        const completedMaterials = await StudyLog.countDocuments({ user: userId, course: courseId, completed: true });

        return (completedMaterials / totalMaterials) * 100;
    } catch (error) {
        console.error("Error in calculateCourseCompletion:", error);
        throw error;
    }
}
