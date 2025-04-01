import { updateSectionProgress, getSectionProgress } from './SectionProgressService.js';

export const updateSectionProgressController = async (req, res) => {
    try {
        const { userId, courseId, sectionId } = req.body;
        const result = await updateSectionProgress(userId, courseId, sectionId);
        res.status(200).json({ success: true, message: 'Cập nhật tiến trình section!', result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật tiến trình section', error: error.message });
    }
};

export const getSectionProgressController = async (req, res) => {
    try {
        const { userId, sectionId } = req.params;
        const progress = await getSectionProgress(userId, sectionId);
        res.status(200).json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy tiến trình section', error: error.message });
    }
};
