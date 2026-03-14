import { body } from 'express-validator'

export const validateUser = [
    body('name')
        .notEmpty()
        .withMessage("Name is required")
        .isString(),

    body('email')
        .isEmail()
        .withMessage("Email is required"),

    body('password')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
]