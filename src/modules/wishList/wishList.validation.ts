import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import mongoose from 'mongoose'

interface WishList {
    productId: typeof mongoose.Types.ObjectId
}

export const wishListSchema = joi.object<WishList>({
    productId: generalFields.Id.required()
}).required()