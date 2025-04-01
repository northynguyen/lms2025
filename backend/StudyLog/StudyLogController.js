import { startStudying, completeStudy, calculateCourseCompletion } from './StudyLogService.js';

// Controller: Bắt đầu học tài liệu
export const startStudyingController = async (req, res) => {
    try {
        const { courseId, sectionId, materialId } = req.body;
        const userId = req.user._id;
        const studyLog = await startStudying(userId, courseId, sectionId, materialId);
        res.status(200).json({ success: true, studyLog });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi bắt đầu học', error: error.message });
    }
};

// Controller: Đánh dấu tài liệu hoàn thành
export const completeStudyController = async (req, res) => {
    try {
        const { materialId } = req.body;
        const userId = req.user._id;
        const studyLog = await completeStudy(userId, materialId);
        if (!studyLog) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy study log' });
        }
        res.status(200).json({ success: true, studyLog });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi hoàn thành tài liệu', error: error.message });
    }
};

// Controller: Tính toán % hoàn thành khóa học
export const calculateCourseCompletionController = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const completionPercentage = await calculateCourseCompletion(userId, courseId);
        res.status(200).json({ success: true, completionPercentage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi tính % hoàn thành', error: error.message });
    }
};
