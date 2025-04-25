import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import CloudConvert from 'cloudconvert';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config();

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);
const pump = promisify(pipeline);

const convertFileToPDF = async (filePath) => {
    const job = await cloudConvert.jobs.create({
        tasks: {
            uploadFile: { operation: 'import/upload' },
            convertFile: {
                operation: 'convert',
                input: 'uploadFile',
                output_format: 'pdf',
            },
            exportFile: {
                operation: 'export/url',
                input: 'convertFile',
            },
        },
    });

    const uploadTask = job.tasks.find(task => task.name === 'uploadFile');

    const form = new FormData();
    Object.entries(uploadTask.result.form.parameters).forEach(([key, value]) => {
        form.append(key, value);
    });
    form.append('file', fs.createReadStream(filePath));

    await axios.post(uploadTask.result.form.url, form, {
        headers: form.getHeaders(),
    });

    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find(task => task.name === 'exportFile');
    const fileUrl = exportTask.result.files[0].url;

    const pdfPath = filePath.replace(path.extname(filePath), '.pdf');
    const writer = fs.createWriteStream(pdfPath);
    const pdfResponse = await axios.get(fileUrl, { responseType: 'stream' });
    pdfResponse.data.pipe(writer);

    await new Promise(resolve => writer.on('finish', resolve));

    return pdfPath;
};

const ensureUploadsFolder = () => {
    const folder = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        ensureUploadsFolder();

        const ext = path.extname(file.originalname).toLowerCase();
        const uploadPath = path.join('uploads', file.originalname);

        const uploadStream = fs.createWriteStream(uploadPath);
        await pump(file.stream, uploadStream);

        let resourceType = 'auto';
        let format = ext.replace('.', '');
        let finalPath = uploadPath;

        if (['.docx', '.xlsx'].includes(ext)) {
            finalPath = await convertFileToPDF(uploadPath);
            fs.unlinkSync(uploadPath);
            format = 'pdf';
            resourceType = 'raw';
        } else if (ext === '.pdf') {
            resourceType = 'raw';
        } else if (['.mp4', '.mp3'].includes(ext)) {
            resourceType = 'video';
        }

        const result = await cloudinary.uploader.upload(finalPath, {
            folder: `course_materials/${req.body.section || 'default'}`,
            public_id: path.basename(finalPath, path.extname(finalPath)),
            format,
            resource_type: resourceType,
        });

        fs.existsSync(finalPath) && fs.unlinkSync(finalPath);

        return {
            folder: result.folder,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type,
        };
    },
});

const multerUpload = multer({ storage });
const uploadMaterial = multerUpload.array('files', 10);

export { uploadMaterial };
