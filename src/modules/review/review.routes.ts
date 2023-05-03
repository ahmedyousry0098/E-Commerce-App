import {Router} from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { addReview } from './review.controller'
import { validate } from '../../middlewares/validation'
import { addReviewSchema } from './review.validation'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router({mergeParams: true})

router.post('/', isAuthenticated, validate(addReviewSchema), asyncHandler(addReview))

export default router