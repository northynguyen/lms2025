import { createTag, getAllTags, getTagById, updateTag, deleteTag, importTags } from './TagService.js';
export const createTagHandler = async (req, res) => {
    try {
        const newTag = await createTag({ ...req.body, createdBy: req.createdBy });
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const importTagHandler = async (req, res) => {
    try {
        const { createdBy, ...tagObjects } = { ...req.body, createdBy: req.createdBy };
        const tagsArray = Object.values(tagObjects).map(tag => ({
            ...tag,
            createdBy
        }));
        if (tagsArray.length === 0) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
        }
        const newTags = await importTags(tagsArray);
        res.status(201).json(newTags);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllTagsHandler = async (req, res) => {
    try {
        const tags = await getAllTags();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTagByIdHandler = async (req, res) => {
    try {
        const tag = await getTagById(req.params.id);
        if (!tag) return res.status(404).json({ message: 'Tag not found' });
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTagHandler = async (req, res) => {
    try {
        const updatedTag = await updateTag(req.params.id, req.body);
        if (!updatedTag) return res.status(404).json({ message: 'Tag not found' });
        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTagHandler = async (req, res) => {
    try {
        const deletedTag = await deleteTag(req.params.id);
        if (!deletedTag) return res.status(404).json({ message: 'Tag not found' });
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const importTagsHandler = async (req, res) => {
    try {
        const { createdBy, ...topicTags } = { ...req.body, createdBy: req.createdBy };
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