import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true },
    description: { type: String }, // Rich text
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    published: { type: Boolean, default: false },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    image: { type: String },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    durationInWeeks: { type: Number },
    language: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: [] }],
}
    , {
        timestamps: true
    });

// Tính giá sau khi giảm giá
courseSchema.methods.getDiscountedPrice = function () {
    return this.price * (1 - this.discount / 100);
};

const Course = mongoose.model('Course', courseSchema);
export default Course;
