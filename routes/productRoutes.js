import Product from '../models/Product.js'
import express from 'express'
import * as productController from '../controller/productController.js'
import { validateProduct } from '../middleware/validationMiddleware.js'
import { handleValidationErrors } from '../middleware/handleValidation.js'
import {
    authenticate,
    authorizeRoles
} from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all Products
 *     description: Return all the products that the seller has
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', authenticate, productController.getProducts)

/**
 * @swagger
 * /api/products/search/{name}:
 *   get:
 *     summary: Find products by name
 *     description: This API helps users find products by their name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Product name to search
 *         schema:
 *           type: string
 *           example: laptop
 *     responses:
 *       200:
 *         description: Products found
 *       404:
 *         description: Product not found
 */
router.get('/search/:name', authenticate, productController.getProductByName)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a single product using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           example: 66522abc
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', authenticate, productController.getProduct)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: This API allows sellers to create new products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
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
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', validateProduct, handleValidationErrors, authenticate, authorizeRoles('seller', 'admin'), productController.createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Update product information using the product ID
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
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch('/:id', authenticate, authorizeRoles('seller', 'admin'), productController.updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/:id', authenticate, authorizeRoles('seller', 'admin'), productController.deleteProduct)

export default router