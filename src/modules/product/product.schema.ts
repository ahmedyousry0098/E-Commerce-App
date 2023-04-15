import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import { Product } from '../../types/Product'
import { Image } from '../../types/general'

type File = {
    mainImg: Image[],
    subImgs: Image[]
}

interface CreateProduct extends Product {
    file: File
}

export const createProductSchema = joi.object<CreateProduct>({
    categoryId: generalFields.Id.required(),
    subCategoryId: generalFields.Id.required(),
    brandId: generalFields.Id.required(),
    name: generalFields.title.required(),
    description: joi.string().regex(/^[A-Za-z0-9-_]{5,1500}$/),
    stock: joi.number().integer().min(1),
    price: joi.number().positive().required(),
    discount: joi.number().min(1).max(100),
    color: joi.array<string>(),
    size: joi.array<string>().valid('s', 'm', 'l', 'xl', 'xxl'),
    file: joi.object<File>({
        mainImg: joi.array().items(generalFields.file.required()).length(1).required(),
        subImgs: joi.array().items(generalFields.file).min(1).max(3),
    }).required()
}).required()