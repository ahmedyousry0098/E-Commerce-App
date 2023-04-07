import {Router} from 'express'
import {addCategory, updateCategory} from './category.controller'
import subCategoryRouter from '../sub-category/sub-category.routes'
import {uploadFile, validation} from '../../utils/multer'
import { asyncHandler } from '../../utils/errorHandling'
import { validate } from '../../middlewares/validation'
import { createCategorySchema, updateCategorySchema } from './category.schema'

const router = Router()

router.use('/:categoryId/subcategory', subCategoryRouter)
router.post('/', uploadFile(validation.image).single('image'), validate(createCategorySchema), asyncHandler(addCategory))
router.put('/:categoryId', uploadFile(validation.image).single('image'), validate(updateCategorySchema), asyncHandler(updateCategory))

export default router