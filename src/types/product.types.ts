import mongoose from 'mongoose'
import { Image } from './general.types'

export interface IProduct {
    customId: string;
    name: string
    slug: string
    description: string
    stock: number
    price: number
    discount: number
    finalPrice: number
    color: string
    size: string[]
    categoryId: typeof mongoose.Types.ObjectId
    subCategoryId: typeof mongoose.Types.ObjectId
    brandId: typeof mongoose.Types.ObjectId
    mainImg: Image
    subImgs: Image[]
    wishList: typeof mongoose.Types.ObjectId []
    isDeleted: boolean
    createdBy: typeof mongoose.Types.ObjectId
    updatedBy: typeof mongoose.Types.ObjectId
}