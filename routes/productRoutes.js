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
 *          - in: query
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
router.post('/', productController.createProduct)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

export default router