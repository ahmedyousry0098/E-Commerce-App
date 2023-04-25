import { Router } from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { createOrder } from './controllers/order.controller'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router()

router.post('/', isAuthenticated, asyncHandler(createOrder))

export default router