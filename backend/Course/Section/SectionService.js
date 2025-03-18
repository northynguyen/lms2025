// SectionService.js
import Section from './Section.js';

// Tạo section mới
export const createSection = async (sectionData) => {
    return await Section.create(sectionData);
};

// Lấy tất cả section theo bộ lọc
export const getAllSections = async (filter = {}) => {
    return await Section.find(filter).populate('course materials');
};

// Lấy section theo ID
export const getSectionById = async (id) => {
    return await Section.findById(id).populate('course materials');
};

// Cập nhật section
export const updateSection = async (id, updateData) => {
    return await Section.findByIdAndUpdate(id, updateData, { new: true }).populate('course materials');
};

// Xóa section
export const deleteSection = async (id) => {
    return await Section.findByIdAndDelete(id);
};