import * as orderController from '../controller/orderController.js'
import express from 'express'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'
import { checkOrderOwnership } from '../middleware/ownershipMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order
 *     description: Create a new order for a product (clients only)
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
 *                 description: ID of the product to order
 *               quantity:
 *                 type: number
 *                 example: 2
 *                 description: Quantity to order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       403:
 *         description: Only clients can place orders
 *       401:
 *         description: Authentication required
 */
router.post('/', authenticate, authorizeRoles('client'), orderController.createOrder)

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     description: Returns all orders based on user role (clients see their orders, sellers see orders for their products, admins see all)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.get('/my-orders', authenticate, authorizeRoles('client', 'admin'), orderController.getMyOrders)

/**
 * @swagger
 * /api/orders/{id}/tracking:
 *   get:
 *     summary: Get order tracking information
 *     description: Retrieve current location, distance remaining and ETA for an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tracking data returned
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.get('/:id/tracking', authenticate, authorizeRoles('client', 'seller', 'admin'), checkOrderOwnership, orderController.getOrderTracking)

/**
 * @swagger
 * /api/orders/{id}/location:
 *   patch:
 *     summary: Update order current location (internal/service)
 *     description: Update GPS coordinates and recalculate ETA/distance
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
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               status:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order location updated
 *       403:
 *         description: Access denied
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */
router.patch('/:id/location', authenticate, authorizeRoles('seller', 'admin'), checkOrderOwnership, orderController.updateOrderLocation)

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

export default router