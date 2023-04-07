import joi from 'joi'
import { generalFields } from '../../constants/validation.schemas'
import { File } from '../../constants/validation.schemas'

interface CreateCategory {
    title: string,
    file: File
}

interface UpdateCategory extends CreateCategory {
    categoryId: string
}

export const createCategorySchema = joi.object<CreateCategory>({
    title: joi.string().required(),
    file: generalFields.file.required()
}).required();

export const updateCategorySchema = joi.object<UpdateCategory>({
    categoryId: generalFields.Id.required(),
    title: joi.string(),
    file: generalFields.file
}).required()