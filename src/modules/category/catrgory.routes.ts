import {Router} from 'express'
import {addCategory, getAllCategories, updateCategory} from './category.controller'
import subCategoryRouter from '../sub-category/sub-category.routes'
import {uploadFile, validation} from '../../utils/multer'
import { asyncHandler } from '../../utils/errorHandling'
import { validate } from '../../middlewares/validation'
import { createCategorySchema, updateCategorySchema } from './category.schema'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router()

router.use('/:categoryId/subcategory', subCategoryRouter)

router.post('/', uploadFile(validation.image).single('image'), validate(createCategorySchema), isAuthenticated, asyncHandler(addCategory))
router.put('/:categoryId', uploadFile(validation.image).single('image'), validate(updateCategorySchema), asyncHandler(updateCategory))
router.get('/', asyncHandler(getAllCategories))

export default router