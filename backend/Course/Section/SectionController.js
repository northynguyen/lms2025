import * as sectionService from './SectionService.js';

export const createSection = async (req, res) => {
    try {
        const section = await sectionService.createSection(req.body);
        res.status(201).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllSections = async (req, res) => {
    try {
        const sections = await sectionService.getAllSections(req.query);
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSectionById = async (req, res) => {
    try {
        const section = await sectionService.getSectionById(req.params.id);
        if (!section) return res.status(404).json({ error: 'Section not found' });
        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSection = async (req, res) => {
    try {
        const updatedSection = await sectionService.updateSection(req.params.id, req.body);
        if (!updatedSection) return res.status(404).json({ error: 'Section not found' });
        res.status(200).json(updatedSection);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSection = async (req, res) => {
    try {
        const deletedSection = await sectionService.deleteSection(req.params.id);
        if (!deletedSection) return res.status(404).json({ error: 'Section not found' });
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
