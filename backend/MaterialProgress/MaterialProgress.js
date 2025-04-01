import mongoose from 'mongoose';

const materialProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseMaterial', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const MaterialProgress = mongoose.model('MaterialProgress', materialProgressSchema);
export default MaterialProgress;