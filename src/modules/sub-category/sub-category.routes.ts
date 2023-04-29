import {Router} from 'express'
import { addSubCategory, updateSubCategory } from './sub-category.controller'
import {uploadFile, validation} from '../../utils/multer'
import {validate} from '../../middlewares/validation'
import { asyncHandler } from '../../utils/errorHandling'
import { createSubCategorySchema, updateSubCategorySchema } from './sub-category.schema'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router({mergeParams: true})

router.post(
    '/', 
    isAuthenticated, 
    uploadFile(validation.image).single('image'), 
    validate(createSubCategorySchema), 
    asyncHandler(addSubCategory)
)
router.put(
    '/:subCategoryId', 
    isAuthenticated,
    uploadFile(validation.image).single('image'), 
    validate(updateSubCategorySchema), 
    asyncHandler(updateSubCategory)
)

export default router
