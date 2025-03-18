import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    orderNumber: { type: Number },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseMaterial' }],
    duration: { type: Number }
}
    , {
        timestamps: true
    });

const Section = mongoose.model('Section', sectionSchema);
export default Section;
