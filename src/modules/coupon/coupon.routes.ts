import { Router } from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { addCoupon, updateCoupon } from './coupon.controller'
import { validate } from '../../middlewares/validation'
import { addCouponSchema, updateCouponSchema } from './coupon.schema'

const router = Router()

router.post('/', validate(addCouponSchema), asyncHandler(addCoupon))
router.put('/:couponId', validate(updateCouponSchema), asyncHandler(updateCoupon))

export default router