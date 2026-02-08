import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedDb: typeof mongoose | null = null;

export const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    try {
        const db = await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });

        cachedDb = db;
        console.log('New MongoDB connection established');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
