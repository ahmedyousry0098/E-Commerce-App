import {Router} from 'express'
import { addToWishList, removeFromWishList } from './wishList.controller'
import { asyncHandler } from '../../utils/errorHandling'
import { isAuthenticated } from '../../middlewares/authentication'
import { validate } from '../../middlewares/validation'
import { wishListSchema } from './wishList.schema'

const router = Router({mergeParams: true})

router.patch('/add', isAuthenticated, validate(wishListSchema), asyncHandler(addToWishList))
router.patch('/remove', isAuthenticated, validate(wishListSchema), asyncHandler(removeFromWishList))

export default router