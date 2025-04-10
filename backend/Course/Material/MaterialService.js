import CourseMaterial from "./Material.js";


export const createMaterial = async (data) => {
    try {
        const material = new CourseMaterial(data);
        await material.save();
        return material;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateMaterial = async (id, updateData) => {
    try {
        const material = await CourseMaterial.findByIdAndUpdate(id, updateData, { new: true });
        if (!material) throw new Error('Material not found');
        return material;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const getAllMaterials = async () => {
    return await CourseMaterial.find()
        .populate('section', 'name')  // Chỉ lấy title của section
        .populate('course', 'name')    // Chỉ lấy name của course
        .populate('createdBy', 'firstName lastName  email')  // Lấy name và email của người tạo
        .populate('updatedBy', 'firstName lastName  email');
};

export const getMaterialById = async (id) => {
    return await CourseMaterial.findById(id)
        .populate('section', 'name')
        .populate('course', 'name')
        .populate('createdBy', 'firstName lastName  email')
        .populate('updatedBy', 'firstName lastName  email')
    // .populate('studyLogs'); // Lấy đầy đủ studyLogs nếu cần
};

export const getMaterialsByUser = async (userId) => {
    return await CourseMaterial.find({ createdBy: userId })
        .populate('section', 'name')
        .populate('course', 'name')
        .populate('updatedBy', 'name email');
};

export const getMaterialsByCourse = async (courseId) => {
    return await CourseMaterial.find({ course: courseId })
        .populate('section', 'name')
        .populate('createdBy', 'firstName lastName email',)
        .populate('updatedBy', 'firstName lastName email');
};

export const deleteMaterial = async (id) => {
    return await CourseMaterial.findByIdAndDelete(id);
};
