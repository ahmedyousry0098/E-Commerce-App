import joi from 'joi'
import { generalFields } from '../../constants/validation.general';
import mongoose from 'mongoose';

interface AddReview {
    productId: typeof mongoose.Types.ObjectId
    rating: number;
    comment: string;
}

export const addReviewSchema = joi.object<AddReview>({
    productId: generalFields.Id.required(),
    rating: joi.number().integer().min(1).max(5).required(),
    comment: joi.string().regex(/^[a-zA-Z0-9_-]{3,2000}$/)
}).required()