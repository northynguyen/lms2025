import mongoose from 'mongoose';

const contentItemSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['VIDEO', 'IMAGE', 'TEXT', 'AUDIO', 'DOCUMENT'],
        required: true
    },
    url: { type: String },
    text: { type: String }
});

const courseMaterialSchema = new mongoose.Schema({
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    materialType: {
        type: String,
        enum: ['ASSIGNMENTS', 'LABS', 'LECTURES', 'REFERENCES', 'ASSESSMENTS'],
        required: true
    },
    materialName: { type: String, required: true },
    title: { type: String, required: true },
    orderNum: { type: Number },
    expectDuration: { type: Number },
    wordCount: { type: Number },
    contentItems: [contentItemSchema],
    studyLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyLog' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);
export default CourseMaterial;
