import {Router} from 'express'
import {addCategory, getAllCategories, updateCategory} from './category.controller'
import subCategoryRouter from '../sub-category/sub-category.routes'
import {uploadFile, validation} from '../../utils/multer'
import { asyncHandler } from '../../utils/errorHandling'
import { validate } from '../../middlewares/validation'
import { createCategorySchema, updateCategorySchema } from './category.validation'
import { isAuthenticated } from '../../middlewares/authentication'

const router = Router()

// router.use(isAuthenticated)
router.use('/:categoryId/subcategory', subCategoryRouter)

router.post('/', isAuthenticated, uploadFile(validation.image).single('image'), validate(createCategorySchema), asyncHandler(addCategory))
router.put('/:categoryId', isAuthenticated, uploadFile(validation.image).single('image'), validate(updateCategorySchema), asyncHandler(updateCategory))
router.get('/', asyncHandler(getAllCategories))

export default router