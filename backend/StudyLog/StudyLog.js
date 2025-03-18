import mongoose from "mongoose";

const studyLogSchema = new mongoose.Schema({
    courseMaterial: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseMaterial', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    studyTime: { type: Number, required: true },
}
    , {
        timestamps: true
    });

const StudyLog = mongoose.model('StudyLog', studyLogSchema);
export default StudyLog;