import Material from './Material.js';

export const createCourseMaterial = async (materialData) => {
    return await Material.create(materialData);
};
export const getAllCourseMaterials = async (filter = {}) => {
    return await Material.find(filter).populate('section');
};

export const getCourseMaterialById = async (id) => {
    return await Material.findById(id).populate('section');
};

export const updateCourseMaterial = async (id, updateData) => {
    return await Material.findByIdAndUpdate(id, updateData, { new: true }).populate('section');
};

export const deleteCourseMaterial = async (id) => {
    return await Material.findByIdAndDelete(id);
};