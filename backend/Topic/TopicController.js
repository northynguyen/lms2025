// TopicController.js
import * as TopicService from './TopicService.js';

export const createTopic = async (req, res) => {
    try {
        const topic = await TopicService.createTopic({ ...req.body, createdBy: req.createdBy });
        res.status(201).json(topic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createMultipleTopics = async (req, res) => {
    try {
        const { createdBy, ...topicObjects } = { ...req.body, createdBy: req.createdBy };
        const topicsArray = Object.values(topicObjects).map(topic => ({
            ...topic,
            createdBy
        }));
        if (topicsArray.length === 0) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
        }
        const topics = await TopicService.createMultipleTopics(topicsArray);
        res.status(201).json(topics);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllTopics = async (req, res) => {
    try {
        const topics = await TopicService.getAllTopics();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTopicById = async (req, res) => {
    try {
        const topic = await TopicService.getTopicById(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });
        res.status(200).json(topic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTopic = async (req, res) => {
    try {
        const updatedTopic = await TopicService.updateTopic(req.params.id, {
            ...req.body,
            updatedBy: req.createdBy,
        });
        if (!updatedTopic) return res.status(404).json({ message: 'Topic not found' });
        res.status(200).json(updatedTopic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTopic = async (req, res) => {
    try {
        const deletedTopic = await TopicService.deleteTopic(req.params.id);
        if (!deletedTopic) return res.status(404).json({ message: 'Topic not found' });
        res.status(200).json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};