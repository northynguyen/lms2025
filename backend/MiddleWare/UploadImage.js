import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Chỉ cho phép upload hình ảnh
const ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const ext = file.mimetype.split('/')[1];
        if (!ALLOWED_IMAGE_FORMATS.includes(ext)) {
            throw new Error('Only image files are allowed (jpg, jpeg, png, webp)');
        }
        return {
            folder: 'courses',
            format: ext,
            public_id: `course_${Date.now()}`
        };
    }
});

const uploadImage = multer({ storage });

export default uploadImage;
