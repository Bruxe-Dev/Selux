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
 * /api/products/search:
 *  get:
 *      summary:Finds products by name
 *      description: This api is to help people find specific product by thier names
 *      parameters:
 *          - in: path
 *          name:name
 *          required:false
 *          description: Product name to search
 *          schema:
 *              type:string
 *              example: laptop
 * 
 *       responses:
 *          200:
 *              description: Products found
 *          404:
 *              description: Product not found
 */
router.get('/search/:name', productController.getProductByName)
/**
* @swagger
* /api/products:
*  post:
*      summary: Creates a new Product
*      description: This api will help sellers create new products that they have purchased
*      requestBody:
*          required: true
*          content:
*              application/json:
*                  schema:
*                      type: object
*                  properties:
*                      name:
*                          type: string
*                          example: Laptop
*                      description:
*                          type: string
*                          example: These are sample shoes 
*                      price:
*                          type: number
*                          example: 1200
*                      quantity:
*                          type: number
*                          example: 5
*      responses:
*          201:
*              description: A new Product created
*/
router.get('/search/:id', productController.getProduct)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product
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
 *         description: Product created
 */
router.post('/', productController.createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
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
 *                  type:boolean
 *     responses:
 *       200:
 *         description: Product updated
 */
router.patch('/:id', productController.updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', productController.deleteProduct)

export default router