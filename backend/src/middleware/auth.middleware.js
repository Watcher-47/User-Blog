import jwt from 'jsonwebtoken';
import { env } from '../utils/dotenv.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                data: [],
                success: false,
                message: 'Authentication required'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, env.jwtSecret);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            data: [],
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            data: [],
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};