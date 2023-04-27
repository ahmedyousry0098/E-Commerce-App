import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import mongoose from 'mongoose'
import { ProductOrderInfo } from '../../types/Order';

interface CreateOrder {
    products: {
        productId: typeof mongoose.Types.ObjectId;
        quantity: number;
    };
    phone: string [],
    adress: string,
    comment: string,
    coupon: string,
    paymentType: string
}

interface CancelOrder {
    orderId: typeof mongoose.Types.ObjectId,
    comment: string
}

export const createOrderSchema = joi.object<CreateOrder>({
    products: joi.object<ProductOrderInfo>({
        productId: generalFields.Id.required(),
        quantity: joi.number().positive().integer()
    }),
    phone: joi.array().items(generalFields.phone.required()).required(),
    adress: joi.string().required(),
    comment: joi.string().min(3).max(1500),
    coupon: joi.string(),
    paymentType: joi.string().valid('credit', 'cash')
}).required()

export const cancelOrderSchema = joi.object<CancelOrder>({
    orderId: generalFields.Id.required(),
    comment: joi.string().min(3).max(1500)
})