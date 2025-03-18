import mongoose from 'mongoose';
const tagSchema = new mongoose.Schema({
    tagName: { type: String, required: true, unique: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    {
        timestamps: true
    });

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
