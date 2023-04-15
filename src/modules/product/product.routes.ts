import {Router} from 'express'
import { uploadFile, validation } from '../../utils/multer'
import { asyncHandler } from '../../utils/errorHandling'
import { createProduct } from './product.controller'
import { isAuthenticated } from '../../middlewares/authentication'
import { validate } from '../../middlewares/validation'
import { createProductSchema } from './product.schema'

const router = Router()

router.post(
    '/', 
    uploadFile(validation.image).fields([
        {name: 'mainImg', maxCount: 1}, 
        {name: 'subImgs', maxCount: 3}
    ]),
    validate(createProductSchema),
    isAuthenticated,
    asyncHandler(createProduct)
)

export default router