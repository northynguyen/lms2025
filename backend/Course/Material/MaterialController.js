import * as MaterialService from './MaterialService.js';

export const createCourseMaterial = async (req, res) => {
    try {
        const material = await MaterialService.createCourseMaterial(req.body);
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllCourseMaterials = async (req, res) => {
    try {
        const materials = await MaterialService.getAllCourseMaterials(req.query);
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourseMaterialById = async (req, res) => {
    try {
        const material = await MaterialService.getCourseMaterialById(req.params.id);
        if (!material) return res.status(404).json({ error: 'CourseMaterial not found' });
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCourseMaterial = async (req, res) => {
    try {
        const updatedMaterial = await MaterialService.updateCourseMaterial(req.params.id, req.body);
        if (!updatedMaterial) return res.status(404).json({ error: 'CourseMaterial not found' });
        res.status(200).json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCourseMaterial = async (req, res) => {
    try {
        const deletedMaterial = await MaterialService.deleteCourseMaterial(req.params.id);
        if (!deletedMaterial) return res.status(404).json({ error: 'CourseMaterial not found' });
        res.status(200).json({ message: 'CourseMaterial deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};