import {Router} from 'express'
import { addSubCategory } from './sub-category.controller'
import { asyncHandler } from '../../utils/errorHandling'

const router = Router({mergeParams: true})

router.post('/', asyncHandler(addSubCategory))

export default router
