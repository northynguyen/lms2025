import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Hỗ trợ upload hình ảnh, PDF, Excel
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'xls', 'xlsx', 'doc', 'docx'];

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const ext = file.mimetype.split('/')[1];
        if (!ALLOWED_FORMATS.includes(ext)) {
            throw new Error('Invalid file type. Allowed: jpg, jpeg, png, webp, gif, pdf, xls, xlsx and doc, docx');
        }
        return {
            folder: 'materials',
            format: ext,
            public_id: `material_${Date.now()}`
        };
    }
});

const uploadMaterial = multer({ storage });

export default uploadMaterial;
