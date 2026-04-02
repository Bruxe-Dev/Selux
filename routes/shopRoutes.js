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

router.get('/:id', authenticate, shopController.getShop)
router.get('/:id/products', authenticate, shopController.getShopProducts)

router.patch('/:id/status', authenticate, authorizeRoles('seller', 'admin'), shopController.updateShopStatus)

export default router
