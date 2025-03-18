import mongoose from 'mongoose';
const topicSchema = new mongoose.Schema({
    topicName: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    {
        timestamps: true
    });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
