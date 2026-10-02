import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.model.js';
import { env } from '../utils/dotenv.js';

export const register = async (req, res) => {
    try {
        const { name, rollnum, password } = req.body;

        const existingUser = await user.findOne({ rollnum });

        if (existingUser) {
            return res.status(409).json({
                data: [],
                success: false,
                message: 'Roll number already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Public registration can ONLY create normal users.
        const newUser = await user.create({
            name,
            rollnum,
            password: hashedPassword,
            role: 'user'
        });

        return res.status(201).json({
            data: {
                id: newUser._id,
                name: newUser.name,
                rollnum: newUser.rollnum,
                role: newUser.role
            },
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Register error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Registration failed'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { rollnum, password } = req.body;

        const existingUser = await user.findOne({ rollnum });

        if (!existingUser) {
            return res.status(401).json({
                data: [],
                success: false,
                message: 'Invalid roll number or password'
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                data: [],
                success: false,
                message: 'Invalid roll number or password'
            });
        }

        const token = jwt.sign(
            {
                id: existingUser._id.toString(),
                role: existingUser.role
            },
            env.jwtSecret,
            {
                expiresIn: '1d'
            }
        );

        return res.status(200).json({
            data: {
                id: existingUser._id,
                name: existingUser.name,
                rollnum: existingUser.rollnum,
                role: existingUser.role,
                token
            },
            success: true,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Login failed'
        });
    }
};