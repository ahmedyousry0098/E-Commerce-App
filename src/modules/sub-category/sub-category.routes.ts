import {Router} from 'express'
import { addSubCategory, updateSubCategory } from './sub-category.controller'
import {uploadFile, validation} from '../../utils/multer'
import {validate} from '../../middlewares/validation'
import { asyncHandler } from '../../utils/errorHandling'
import { createSubCategorySchema, updateSubCategorySchema } from './sub-category.schema'

const router = Router({mergeParams: true})

router.post('/', uploadFile(validation.image).single('image'), validate(createSubCategorySchema), asyncHandler(addSubCategory))
router.put(
    '/:subCategoryId', 
    uploadFile(validation.image).single('image'), 
    validate(updateSubCategorySchema), 
    asyncHandler(updateSubCategory)
)

export default router
