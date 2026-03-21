import express from 'express'
import * as adminController from '../controller/adminController.js'
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Admin only - Get all users categorized by role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Admin access required
 */
router.get('/users', authenticate, authorizeAdmin, adminController.getAllUsers)

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     description: Admin only - Get all orders in the system
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/orders', authenticate, authorizeAdmin, adminController.getAllOrders)

/**
 * @swagger
 * /api/admin/users/{type}/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Admin only - Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, seller]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/users/:type/:id', authenticate, authorizeAdmin, adminController.deleteUser)

/**
 * @swagger
 * /api/admin/users/{type}/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: Admin only - Change a user's role
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, seller]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [client, admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/users/:type/:id/role', authenticate, authorizeAdmin, adminController.updateUserRole)

export default router