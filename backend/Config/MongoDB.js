import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGOOSE_URL,
};

// Kết nối MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('Kết nối MongoDB thành công');
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err);
        process.exit(1);
    }
};