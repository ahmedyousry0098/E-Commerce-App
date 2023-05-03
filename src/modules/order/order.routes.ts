import { Router } from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { createOrder, cancelOrder } from './order.controller'
import { isAuthenticated } from '../../middlewares/authentication'
import { validate } from '../../middlewares/validation'
import { cancelOrderSchema, createOrderSchema } from './order.validation'

const router = Router()

router.post('/', isAuthenticated, validate(createOrderSchema),  asyncHandler(createOrder))
router.patch('/cancel/:orderId', isAuthenticated, validate(cancelOrderSchema), asyncHandler(cancelOrder))
export default router