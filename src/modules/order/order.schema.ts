import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import mongoose from 'mongoose'
import { ProductOrderInfo, Address } from '../../types/Order';

interface CreateOrder {
    products: {
        productId: typeof mongoose.Types.ObjectId;
        quantity: number;
    };
    phone: string [],
    address: Address,
    comment: string,
    couponId: string,
    paymentType: string
}

interface CancelOrder {
    orderId: typeof mongoose.Types.ObjectId,
    comment: string
}

export const createOrderSchema = joi.object<CreateOrder>({
    products: joi.array().items(joi.object<ProductOrderInfo>({
        productId: generalFields.Id.required(),
        quantity: joi.number().positive().integer()
    }).required()),
    phone: joi.array().items(generalFields.phone.required()).required(),
    address: joi.object<Address>({
        apartment: joi.string().required(),
        building: joi.string().required(),
        street: joi.string().required(),
        city: joi.string().required(),
    }),
    comment: joi.string().min(3).max(1500),
    couponId: generalFields.Id,
    paymentType: joi.string().valid('credit', 'cash')
}).required()

export const cancelOrderSchema = joi.object<CancelOrder>({
    orderId: generalFields.Id.required(),
    comment: joi.string().min(3).max(1500)
})