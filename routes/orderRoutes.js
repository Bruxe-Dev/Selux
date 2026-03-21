import * as orderController from '../controller/orderController.js'
import express from 'express'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order
 *     description: Customer creates an order from a seller's product
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6657f1b8c12abf0034e1a123
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorizeRoles('client'), orderController.createOrder)

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     description: Returns all orders placed by the authenticated user
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 */
router.get('/my-orders', authenticate, authorizeRoles('client', 'admin'), orderController.getMyOrders)

export default router

// ... existing code ...

/**
 * @swagger
 * /api/orders/seller:
 *   get:
 *     summary: Get orders for seller's products
 *     description: Sellers can view all orders placed for their products
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders for seller's products
 *       403:
 *         description: Seller access required
 */
router.get('/seller', authenticate, authorizeRoles('seller'), orderController.getSellerOrders)

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Sellers can update the status of orders for their products
 *     tags:
 *       - Orders
 *     parameters:
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
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Access denied
 */
router.patch('/:id/status', authenticate, checkOrderOwnership, orderController.updateOrderStatus)

// ... existing code ...