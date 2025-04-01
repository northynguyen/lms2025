import Course from './Course.js';

export const createCourse = async (courseData, file) => {
    if (file) {
        courseData.image = file.path;
    }
    return await Course.create(courseData);
};

export const getAllCourses = async (filter = {}) => {
    const courses = await Course.find(filter)
        .populate('createdBy updatedBy instructor prerequisites tags language sections').sort({ createdAt: -1 });

    // Thêm discountedPrice vào mỗi khóa học
    return courses.map(course => ({
        ...course.toObject(),
        discountedPrice: course.getDiscountedPrice()
    }));
};

export const getCourseById = async (id) => {
    return await Course.findById(id).populate('createdBy updatedBy instructor prerequisites tags language sections');
};

export const updateCourse = async (id, updateData, file) => {
    if (file) updateData.image = file.path;
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCourse = async (id) => {
    return await Course.findByIdAndDelete(id);
};