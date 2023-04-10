import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import { File } from '../../constants/validation.general'

interface CreateCategory {
    title: string,
    file: File
}

interface UpdateCategory extends CreateCategory {
    categoryId: string
}

export const createCategorySchema = joi.object<CreateCategory>({
    title: generalFields.title.required(),
    file: generalFields.file.required()
}).required();

export const updateCategorySchema = joi.object<UpdateCategory>({
    categoryId: generalFields.Id.required(),
    title: generalFields.title,
    file: generalFields.file
}).required()