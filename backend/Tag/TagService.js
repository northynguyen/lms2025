import Tag from './Tag.js';
export const createTag = async (tagData) => {
    return await Tag.create(tagData);
};

export const importTags = async (tags) => {
    return await Tag.insertMany(tags, { ordered: false });
};


export const getAllTags = async () => {
    return await Tag.find().populate('topic createdBy');
};

export const getTagById = async (id) => {
    return await Tag.findById(id).populate('topic createdBy');
};

export const updateTag = async (id, updateData) => {
    return await Tag.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteTag = async (id) => {
    return await Tag.findByIdAndDelete(id);
};