import mongoose from 'mongoose';
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
    materialUrl: { type: String },
    orderNum: { type: Number },
    expectDuration: { type: Number }, // Thời gian dự kiến hoàn thành
    wordCount: { type: Number },
    courseMaterialType: { type: String, enum: ['VIDEO', 'DOCUMENT', 'TEXT', 'AUDIO'] },
    content: { type: String },
    studyLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyLog' }],
}
    , {
        timestamps: true
    });

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);
export default CourseMaterial;
