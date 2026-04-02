import express from 'express'
import * as authController from '../controller/authController.js'
import { validateUser } from '../middleware/validateUser.js'
import { handleValidationErrors } from '../middleware/handleValidation.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account (requires email confirmation)
 *     tags:
 *      - Authentication & Authorization
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
 *               role:
 *                 type: string
 *                 enum: [client, seller, admin]
 *                 example: client
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Registration initiated - check email for confirmation
 *       400:
 *         description: Invalid input or user already exists
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
 *     tags:
 *      - Authentication & Authorization
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email confirmation token
 *     responses:
 *       201:
 *         description: Email confirmed and user registered successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/confirm-email', authController.confirmEmail)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     tags:
 *      - Authentication & Authorization
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
 *         description: Login successful - returns JWT token
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', authController.login)

router.post('forgot-password', authController.forgotPassword)
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Instruct client to discard JWT (stateless) and end session
 *     tags:
 *      - Authentication & Authorization
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticate, authController.logout)

export default router