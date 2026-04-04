import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from '../server/routes/auth.js';

const app = express();

// Serverless-friendly mongoose settings
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        isConnected = false;
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Health check (no DB needed)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Ensure DB connection before auth routes
app.use('/api/auth', async (req, res, next) => {
    try {
        await connectDB();
        if (!isConnected) {
            return res.status(503).json({ message: 'Database not available' });
        }
        next();
    } catch (err) {
        return res.status(503).json({ message: 'Database connection failed', error: err.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);

export default app;
