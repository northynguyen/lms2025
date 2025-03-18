// TopicService.js
import Topic from './Topic.js';

export const createTopic = async (data) => {
    return await Topic.create(data);
};

export const createMultipleTopics = async (topics) => {
    return await Topic.insertMany(topics);
};

export const getAllTopics = async () => {
    return await Topic.find().populate('createdBy');
};

export const getTopicById = async (id) => {
    return await Topic.findById(id).populate('createdBy');
};

export const updateTopic = async (id, data) => {
    return await Topic.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTopic = async (id) => {
    return await Topic.findByIdAndDelete(id);
};