import { updateMaterialProgress, getMaterialProgress } from './MaterialProgressService.js';

export const updateMaterialProgressController = async (req, res) => {
    try {
        const { userId, courseId, sectionId, materialId, progress } = req.body;
        const result = await updateMaterialProgress(userId, courseId, sectionId, materialId, progress);
        res.status(200).json({ success: true, message: 'Cập nhật tiến trình tài liệu!', result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật tiến trình', error: error.message });
    }
};

export const getMaterialProgressController = async (req, res) => {
    try {
        const { userId, materialId } = req.params;
        const progress = await getMaterialProgress(userId, materialId);
        res.status(200).json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy tiến trình', error: error.message });
    }
};
