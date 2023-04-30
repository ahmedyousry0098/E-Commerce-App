import {Router} from 'express'
import { uploadFile, validation } from '../../utils/multer'
import { asyncHandler } from '../../utils/errorHandling'
import { createProduct, getProducts, updateProduct } from './product.controller'
import { isAuthenticated } from '../../middlewares/authentication'
import { validate } from '../../middlewares/validation'
import { createProductSchema, getProductsSchema, updateProductSchema } from './product.schema'
import reviewRouter from '../review/review.routes'
import wishListRouter from '../wishList/wishList.routes'

const router = Router()

router.use('/:productId/review', reviewRouter)
router.use('/:productId/wishlist', wishListRouter)

router.post(
    '/', 
    isAuthenticated,
    uploadFile(validation.image).fields([
        {name: 'mainImg', maxCount: 1}, 
        {name: 'subImgs', maxCount: 3}
    ]),
    validate(createProductSchema),
    asyncHandler(createProduct)
)

router.put(
    '/:productId',
    isAuthenticated,
    uploadFile(validation.image).fields([
        {name: 'mainImg', maxCount: 1},
        {name: 'subImgs', maxCount: 3},
    ]),
    validate(updateProductSchema),
    asyncHandler(updateProduct)
)

router.get('/', asyncHandler(getProducts))

export default router