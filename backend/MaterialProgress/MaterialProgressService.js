import MaterialProgress from './MaterialProgress.js';

export const updateMaterialProgress = async (userId, courseId, sectionId, materialId, progress) => {
    let materialProgress = await MaterialProgress.findOne({ user: userId, material: materialId });

    if (!materialProgress) {
        materialProgress = new MaterialProgress({ user: userId, course: courseId, section: sectionId, material: materialId });
    }

    materialProgress.progress = progress;
    materialProgress.completed = progress === 100;
    await materialProgress.save();

    return materialProgress;
};

export const getMaterialProgress = async (userId, materialId) => {
    return await MaterialProgress.findOne({ user: userId, material: materialId });
};
