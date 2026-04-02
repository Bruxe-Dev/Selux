import express from 'express'
import * as shopController from '../controller/shopController.js'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get all shops
 *     description: Returns all sellers with open/closed status.
 *     tags:
 *      - Shops
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED]
 *         description: Filter shops by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by shop name
 *     responses:
 *       200:
 *         description: List of shops
 */
router.get('/', authenticate, shopController.getShops)

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get one shop
 *     description: Returns the shop information for the given seller ID.
 *     tags:
 *      - Shops
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: Shop retrieved
 *       404:
 *         description: Shop not found
 */
router.get('/:id', authenticate, shopController.getShop)

/**
 * @swagger
 * /api/shops/{id}/products:
 *   get:
 *     summary: Get products of a shop
 *     description: Returns products from the selected shop.
 *     tags:
 *      - Shops
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: Products retrieved
 *       404:
 *         description: Shop not found
 */
router.get('/:id/products', authenticate, shopController.getShopProducts)

/**
 * @swagger
 * /api/shops/{id}/status:
 *   patch:
 *     summary: Set shop open/closed status
 *     description: Sellers (or admins) can update shop status.
 *     tags:
 *      - Shops
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Seller not found
 */
router.patch('/:id/status', authenticate, authorizeRoles('seller', 'admin'), shopController.updateShopStatus)

export default router
