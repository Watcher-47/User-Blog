import { Router } from 'express';

import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    updateBlog
} from '../controllers/blog.controller.js';

import {
    authMiddleware,
    adminMiddleware
} from '../middleware/auth.middleware.js';

import {
    blogValidation
} from '../middleware/validation.middleware.js';

const router = Router();

// Public
router.get('/', getAllBlogs);
router.get('/:id', getBlog);

// Admin only
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    blogValidation,
    createBlog
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    blogValidation,
    updateBlog
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteBlog
);

export default router;