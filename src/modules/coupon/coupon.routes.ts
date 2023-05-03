import { Router } from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { addCoupon, updateCoupon } from './coupon.controller'
import { validate } from '../../middlewares/validation'
import { addCouponSchema, updateCouponSchema } from './coupon.validation'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router()

router.post('/', isAuthenticated, validate(addCouponSchema), asyncHandler(addCoupon))
router.put('/:couponId', isAuthenticated, validate(updateCouponSchema), asyncHandler(updateCoupon))

export default router