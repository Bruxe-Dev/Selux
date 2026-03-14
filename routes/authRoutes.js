import express from 'express'
import * as authController from '../controller/authController'
import { validateUser } from '../middleware/validateUser'
import { handleValidationErrors } from '../middleware/handleValidation'

const router = express.Router()

router.post('/register', authController.register, validateUser, handleValidationErrors)
router.post('/login', authController.login)

export default router