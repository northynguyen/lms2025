import SectionProgress from './SectionProgress.js';
import CourseMaterial from '../Course/Material/Material.js';

export const updateSectionProgress = async (userId, courseId, sectionId) => {
    const totalMaterials = await CourseMaterial.countDocuments({ section: sectionId });
    const completedMaterials = await MaterialProgress.countDocuments({ user: userId, section: sectionId, completed: true });

    let sectionProgress = await SectionProgress.findOne({ user: userId, section: sectionId });

    if (!sectionProgress) {
        sectionProgress = new SectionProgress({ user: userId, course: courseId, section: sectionId });
    }

    sectionProgress.progress = totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 0;
    sectionProgress.completed = sectionProgress.progress === 100;
    await sectionProgress.save();

    return sectionProgress;
};

export const getSectionProgress = async (userId, sectionId) => {
    return await SectionProgress.findOne({ user: userId, section: sectionId });
};
