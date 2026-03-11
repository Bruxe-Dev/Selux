import { authenticate } from "../middleware/authMiddleware";
import * as productController from '../controller/productController'
import express from 'express'

const router = express.Router()

router.post('/', authenticate, productController.createProduct)

export default router; 