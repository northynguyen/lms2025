import mongoose from 'mongoose';
// Schema theo dõi tiến trình của từng Section
const sectionProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const SectionProgress = mongoose.model('SectionProgress', sectionProgressSchema);
export default SectionProgress;