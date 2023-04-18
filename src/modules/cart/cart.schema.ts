import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import {Cart} from '../../types/Cart'
import mongoose from 'mongoose'

interface CartSchema {
    productId: typeof mongoose.Types.ObjectId;
    quantity: number;
}

export const addCartSchema = joi.object<CartSchema>({
    productId: generalFields.Id.required(),
    quantity: joi.number().integer().positive().min(1).required()
}).required()