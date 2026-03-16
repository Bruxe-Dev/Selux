import * as orderController from '../controller/orderController.js'
import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authenticate, orderController.createOrder)