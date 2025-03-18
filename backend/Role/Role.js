import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true, // Thêm createdAt và updatedAt
});
const Role = mongoose.model('Role', roleSchema);
export default Role;


