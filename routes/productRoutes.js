import Product from '../models/Product.js'
import express from 'express'
import * as productController from '../controller/productController.js'
const router = express.Router()

router.get('/', productController.getProducts)
router.post('/', productController.createProduct)
router.get('/:id', productController.getProduct)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

export default router