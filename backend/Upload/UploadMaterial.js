// middleware/uploadMaterial.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        let resourceType = 'auto';

        if (['.pdf', '.docx', '.xlsx', '.txt'].includes(ext)) {
            resourceType = 'raw';
        } else if (['.mp4', '.mp3'].includes(ext)) {
            resourceType = 'video';
        }

        return {
            folder: 'course_materials',
            format: ext.replace('.', ''),
            resource_type: resourceType
        };
    }
});

const multerUpload = multer({ storage });
const uploadMaterial = multerUpload.array('files', 10);

export { uploadMaterial };
