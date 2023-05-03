import joi from 'joi'
import { generalFields } from '../../constants/validation.general'
import { Duration } from '../../types/general.types';

interface CouponValidationSchema {
    code: string;
    amount: number;
    duration: Duration;
    status: string
}

export const addCouponSchema = joi.object<CouponValidationSchema>({
    code: joi.string().required(),
    amount: joi.number().positive().min(1).max(100).required(),
    duration: generalFields.duration.required(),
    status: joi.string().valid('Valid', 'Expired')
}).required()

export const updateCouponSchema = joi.object<CouponValidationSchema>({
    code: joi.string(),
    amount: joi.number().positive().min(1).max(100),
    duration: generalFields.duration,
    status: joi.string().valid('Valid', 'Expired')
}).required()
