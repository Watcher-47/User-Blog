import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            data: [],
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    next();
};

const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('rollnum')
        .isInt({ min: 1 })
        .withMessage('Roll number must be a positive number'),

    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters'),

    handleValidationErrors
];

const loginValidation = [
    body('rollnum')
        .isInt({ min: 1 })
        .withMessage('Roll number must be a positive number'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

const blogValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('desc')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 20 })
        .withMessage('Content must be at least 20 characters'),

    body('image')
        .trim()
        .isURL()
        .withMessage('Image must be a valid URL'),

    body('rating')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),

    handleValidationErrors
];

export {
    registerValidation,
    loginValidation,
    blogValidation
};