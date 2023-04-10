import joi from 'joi'
import { generalFields } from '../../constants/validation.general'

export const addCouponSchema = joi.object({
    code: joi.string().required(),
    amount: joi.number().positive().min(1).max(100).required(),
    duration: generalFields.duration.required(),
    status: joi.string().valid('Valid', 'Expired')
}).required()

export const updateCouponSchema = joi.object({
    code: joi.string(),
    amount: joi.number().positive().min(1).max(100),
    duration: generalFields.duration,
    status: joi.string().valid('Valid', 'Expired')
}).required()
