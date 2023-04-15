import { Router } from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { addCoupon, updateCoupon } from './coupon.controller'
import { validate } from '../../middlewares/validation'
import { addCouponSchema, updateCouponSchema } from './coupon.schema'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router()

router.post('/', validate(addCouponSchema), isAuthenticated, asyncHandler(addCoupon))
router.put('/:couponId', validate(updateCouponSchema), isAuthenticated, asyncHandler(updateCoupon))

export default router