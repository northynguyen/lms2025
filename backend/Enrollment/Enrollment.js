import mongoose from "mongoose";

const enrollmentStatusHistorySchema = new mongoose.Schema({
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
})
const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    grade: { type: Number, default: 0 },
    statusHistory: [enrollmentStatusHistorySchema]
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;