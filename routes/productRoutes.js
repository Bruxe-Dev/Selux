import express from 'express'
import * as productController from '../controller/productController.js'
import { validateProduct } from '../middleware/validationMiddleware.js'
import { handleValidationErrors } from '../middleware/handleValidation.js'
import {
    authenticate,
    authorizeRoles
} from '../middleware/authMiddleware.js'
import { checkProductOwnership } from '../middleware/ownershipMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all Products
 *     description: Return products based on user role (sellers see their products, others see all)
 *     tags:
 *      - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *       401:
 *         description: Authentication required
 */
router.get('/', authenticate, productController.getProducts)

/**
 * @swagger
 * /api/products/search/{name}:
 *   get:
 *     summary: Find products by name
 *     description: Search for products by name (case-insensitive)
 *     tags:
 *      - Products
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Product name to search
 *         schema:
 *           type: string
 *           example: laptop
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products found
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 */
router.get('/search/:name', authenticate, productController.getProductByName)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a single product using its ID
 *     tags:
 *      - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           example: 66522abc
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 */
router.get('/:id', authenticate, productController.getProduct)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product (sellers and admins only)
 *     tags:
 *      - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: High performance laptop
 *               price:
 *                 type: number
 *                 example: 1200
 *               quantity:
 *                 type: number
 *                 example: 5
 *               discount:
 *                 type: number
 *                 example: 10
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Only sellers and admins can create products
 *       401:
 *         description: Authentication required
 */
router.post('/', validateProduct, handleValidationErrors, authenticate, authorizeRoles('seller', 'admin'), productController.createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Update product information (sellers can only update their own products)
 *     tags:
 *      - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               discount:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Not authorized to update this product
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 */
router.patch('/:id', authenticate, authorizeRoles('seller', 'admin'), checkProductOwnership, productController.updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product (sellers can only delete their own products)
 *     tags:
 *      - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Not authorized to delete this product
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 */
router.delete('/:id', authenticate, authorizeRoles('seller', 'admin'), checkProductOwnership, productController.deleteProduct)

export default router