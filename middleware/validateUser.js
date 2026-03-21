import { body } from 'express-validator'

export const validateUser = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString(),

    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('role')
        .optional()
        .isIn(['seller', 'client', 'admin'])
        .withMessage('Role must be one of seller, client, admin'),

    body('phone')
        .optional()
        .isString()
        .withMessage('Phone must be a string')
]