import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },

    status: {
        type: String,
        enum: ['ACTIVE', 'DEACTIVE', 'CANCEL', 'FINISH', 'EXPIRED'],
        default: 'ACTIVE'
    },

    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    enrollmentDate: { type: Date, required: true },
    deadline: { type: Date },
    completionDate: { type: Date },

    sectionsProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SectionProgress' }],
    materialsProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaterialProgress' }],
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
