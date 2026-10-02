import mongoose from 'mongoose';
import { env } from './dotenv.js';

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(env.mongoUri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};