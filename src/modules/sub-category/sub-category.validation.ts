import joi from 'joi'
import {generalFields} from '../../constants/validation.general'

export const createSubCategorySchema = joi.object({
    categoryId: generalFields.Id.required(),
    title: generalFields.title.required(),
    file: generalFields.file.required()
}).required()

export const updateSubCategorySchema = joi.object({
    categoryId: generalFields.Id.required(),
    subCategoryId: generalFields.Id.required(),
    title: generalFields.title,
    file: generalFields.file
}).required()