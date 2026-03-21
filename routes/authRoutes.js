import express from 'express'
import * as authController from '../controller/authController.js'
import { validateUser } from '../middleware/validateUser.js'
import { handleValidationErrors } from '../middleware/handleValidation.js'

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user
 *     tags:
 *      - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
    '/register',
    validateUser,
    handleValidationErrors,
    authController.register
)

/**
 * @swagger
 * /api/auth/confirm-email:
 *   get:
 *     summary: Confirm email
 *     description: Confirm user email to complete registration
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Email confirmed and user registered
 */
router.get('/confirm-email', authController.confirmEmail)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login)

export default router