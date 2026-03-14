import { body } from "express-validator";

export const validateProduct = [
    body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .isString()
        .withMessage('Product name must be a string'),

    body('price')
        .notEmpty()
        .withMessage('Enter the product price')
        .isFloat({ gt: 0 })
        .withMessage('Product must be a positive number'),

    body('description')
        .notEmpty()
        .isString()
        .optional()
        .withMessage("Description must be a string"),

    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be zero or a positive integer'),
]