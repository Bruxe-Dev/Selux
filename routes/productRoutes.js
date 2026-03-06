import Product from '../models/Product.js'
import express from 'express'
import * as productController from '../controller/productController.js'
const router = express.Router()

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get all Products
 *      description: Return all the products that the Seller has
 *      responses:
 *          200:
 *             description: A list of products
 */
router.get('/', productController.getProducts)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new Product
 *      description:THis api will help sellers create new products that they have purchased
 *      responses:
 *          200:
 *              description: A new Product created
 */
router.post('/', productController.createProduct)
router.get('/:id', productController.getProduct)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

export default router