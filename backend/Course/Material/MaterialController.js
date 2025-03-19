import * as courseMaterialService from "./MaterialService.js";
import CourseMaterial from "./Material.js"; // Nếu cần dùng trong update

const processContentItems = (contentItems, files) => {
    let combinedContentItems = [];
    let fileIndex = 0;

    let parsedContentItems = contentItems ? JSON.parse(contentItems) : [];

    parsedContentItems.forEach(item => {
        if (item.type === 'TEXT') {
            combinedContentItems.push({ type: 'TEXT', text: item.text });
        } else if (item.type === 'FILE' && files[fileIndex]) {
            let file = files[fileIndex];
            let fileType = 'DOCUMENT'; // Mặc định là tài liệu

            if (file.mimetype.startsWith('image/')) fileType = 'IMAGE';
            else if (file.mimetype.startsWith('video/')) fileType = 'VIDEO';
            else if (file.mimetype.startsWith('audio/')) fileType = 'AUDIO';

            combinedContentItems.push({ type: fileType, url: file.path });
            fileIndex++;
        } else if (item.type && item.url) {
            combinedContentItems.push(item); // Giữ nguyên dữ liệu file cũ
        }
    });

    return combinedContentItems;
};

export const createMaterial = async (req, res) => {
    try {
        const { section, course, materialType, materialName, title, orderNum, expectDuration, wordCount, contentItems } = req.body;
        const userId = req.user.id;

        const processedContentItems = processContentItems(contentItems, req.files);

        const materialData = {
            section, course, materialType, materialName, title, orderNum, expectDuration, wordCount,
            contentItems: processedContentItems, createdBy: userId, updatedBy: userId
        };

        const material = await courseMaterialService.createMaterial(materialData);
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateMaterial = async (req, res) => {
    try {
        const { materialType, materialName, title, orderNum, expectDuration, wordCount, contentItems } = req.body;
        const updatedBy = req.user.id;

        const existingMaterial = await CourseMaterial.findById(req.params.id);
        if (!existingMaterial) return res.status(404).json({ message: "Material not found" });

        const processedContentItems = processContentItems(contentItems, req.files);

        const updateData = {
            materialType, materialName, title, orderNum, expectDuration, wordCount,
            contentItems: processedContentItems, updatedBy
        };

        const updatedMaterial = await courseMaterialService.updateMaterial(req.params.id, updateData);
        res.status(200).json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllMaterials = async (req, res) => {
    try {
        const materials = await courseMaterialService.getAllMaterials();
        res.json(materials);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMaterialById = async (req, res) => {
    try {
        const material = await courseMaterialService.getMaterialById(req.params.id);
        if (!material) return res.status(404).json({ message: "Material not found" });
        res.json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMaterialsByUser = async (req, res) => {
    try {
        const materials = await courseMaterialService.getMaterialsByUser(req.params.userId);
        res.json(materials);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMaterialsByCourse = async (req, res) => {
    try {
        const materials = await courseMaterialService.getMaterialsByCourse(req.params.courseId);
        res.json(materials);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        await courseMaterialService.deleteMaterial(req.params.id);
        res.json({ message: "Material deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
