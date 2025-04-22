import Course from './Course.js';

export const createCourse = async (courseData, file) => {
    if (file) {
        courseData.image = file.path;
    }
    return await Course.create(courseData);
};

export const getAllCourses = async (filter = {}) => {
    const courses = await Course.find(filter)
        .populate('createdBy updatedBy instructor language').sort({ createdAt: -1 });

    // Thêm discountedPrice vào mỗi khóa học
    return courses.map(course => ({
        ...course.toObject(),
        discountedPrice: course.getDiscountedPrice()
    }));
};

export const getCourseById = async (id) => {
    return await Course.findById(id)
        .populate('createdBy updatedBy instructor prerequisites tags language')
        .populate({
            path: 'sections',
            populate: {
                path: 'materials',
                model: 'CourseMaterial',
            },
        });
};

export const updateCourse = async (id, updateData, file) => {
    if (file) updateData.image = file.path;
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCourse = async (id) => {
    return await Course.findByIdAndDelete(id);
};

export const searchCourses = async (query, level, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const matchConditions = [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { "language.name": { $regex: query, $options: 'i' } }, // ✅ sửa ở đây
        { "instructorInfo.name": { $regex: query, $options: 'i' } },
        { "tagObjects.tagName": { $regex: query, $options: 'i' } }
    ];

    const matchStage = {
        published: true,
        $or: matchConditions
    };

    if (level && level !== 'All') {
        matchStage.level = level;
    }

    const pipeline = [
        { $match: { published: true } },

        { $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tagObjects' } },
        { $lookup: { from: 'users', localField: 'instructor', foreignField: '_id', as: 'instructorInfo' } },
        { $unwind: { path: '$instructorInfo', preserveNullAndEmptyArrays: true } },

        { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },

        { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy' } },
        { $unwind: { path: '$updatedBy', preserveNullAndEmptyArrays: true } },

        { $lookup: { from: 'courses', localField: 'prerequisites', foreignField: '_id', as: 'prerequisites' } },

        { $lookup: { from: 'languages', localField: 'language', foreignField: '_id', as: 'language' } },
        { $unwind: { path: '$language', preserveNullAndEmptyArrays: true } },

        { $lookup: { from: 'sections', localField: 'sections', foreignField: '_id', as: 'sections' } },

        { $match: matchStage },

        { $sort: { createdAt: -1 } },

        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            name: 1,
                            code: 1,
                            level: 1,
                            language: 1,
                            price: 1,
                            discount: 1,
                            image: 1,
                            published: 1,
                            createdAt: 1,
                            instructorInfo: { name: 1, email: 1 },
                            tagObjects: { tagName: 1 },
                            createdBy: { name: 1, email: 1 },
                            updatedBy: { name: 1, email: 1 },
                            prerequisites: { name: 1, code: 1 },
                            sections: { name: 1 }
                        }
                    }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        }
    ];

    const result = await Course.aggregate(pipeline);
    const courses = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
        data: courses,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

