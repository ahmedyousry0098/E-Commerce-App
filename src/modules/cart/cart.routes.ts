import {Router} from 'express'
import { asyncHandler } from '../../utils/errorHandling'
import { addCart } from './cart.controller'
import { isAuthenticated } from '../../middlewares/authentication'
import { validate } from '../../middlewares/validation'
import { addCartSchema } from './cart.schema'

const router = Router()

router.post('/', validate(addCartSchema), isAuthenticated, asyncHandler(addCart))

export default router