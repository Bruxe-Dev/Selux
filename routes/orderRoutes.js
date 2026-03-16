import * as orderController from '../controller/orderController.js'
import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/order:
 * post:
 *  summary: Create an order
 *  description: The customer creates an order from ones store
 *  requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required: true:
 *                        - productId
 *                        - quantity
 *                  properties:
 *                      productId:
 *                          type:string
 *                          example:1e2342d3rft25d4
 *                      quantity:
 *                          type: number
 *                          example: 10
 *      responses:
 *          201:
 *              description: Order created Successfully
 */
router.post('/', authenticate, orderController.createOrder)
router.get('/my-orders', authenticate, orderController.getMyOrders)

export default router;