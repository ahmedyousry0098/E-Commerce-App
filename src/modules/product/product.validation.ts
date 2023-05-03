import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import { IProduct } from '../../types/product.types'
import { Image } from '../../types/general.types'

type File = {
    mainImg: Image[],
    subImgs: Image[]
}

interface ProductSchema extends IProduct {
    file: File
}

export const createProductSchema = joi.object<ProductSchema>({
    categoryId: generalFields.Id.required(),
    subCategoryId: generalFields.Id.required(),
    brandId: generalFields.Id.required(),
    name: generalFields.title.required(),
    description: joi.string().regex(/^[A-Za-z0-9-_]{5,1500}$/),
    stock: joi.number().integer().min(1),
    price: joi.number().positive().required(),
    discount: joi.number().min(1).max(100),
    color: joi.array<string>(),
    size: joi.array<string>().items(joi.valid('s', 'm', 'l', 'xl', 'xxl')),
    file: joi.object<File>({
        mainImg: joi.array().items(generalFields.file.required()).length(1).required(),
        subImgs: joi.array().items(generalFields.file).min(1).max(3),
    }).required()
}).required()

export const updateProductSchema = joi.object<ProductSchema>({
    categoryId: generalFields.Id,
    subCategoryId: generalFields.Id,
    brandId: generalFields.Id,
    name: generalFields.title,
    description: joi.string().regex(/^[A-Za-z0-9-_]{5,1500}$/),
    stock: joi.number().integer().min(1),
    price: joi.number().positive(),
    discount: joi.number().min(1).max(100),
    color: joi.array<string>(),
    size: joi.array<string>().items(joi.valid('s', 'm', 'l', 'xl', 'xxl')),
    file: joi.object<File>({
        mainImg: joi.array().items(generalFields.file.required()).length(1),
        subImgs: joi.array().items(generalFields.file).max(3),
    })
}).required()

export const getProductsSchema = joi.object({
    page: joi.number().integer().positive(),
    limit: joi.number().integer().positive(),
    sort: joi.string(),
    search: joi.string(),
}).required()