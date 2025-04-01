import mongoose from "mongoose";

const studyLogSchema = new mongoose.Schema({
    courseMaterial: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseMaterial', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true, default: 0 },
    studyTime: { type: Number, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
}
    , {
        timestamps: true
    });

const StudyLog = mongoose.model('StudyLog', studyLogSchema);
export default StudyLog;