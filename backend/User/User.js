import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    is2faEnabled: { type: Boolean, default: false, immutable: true },
    isLocked: { type: Boolean, default: false },
    studentCode: { type: String },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    createdCourses: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Course',
            createdAt: { type: Date, default: Date.now },
        }

    ],
}, {
    timestamps: true
});

const User = model('User', userSchema);

export default User;
