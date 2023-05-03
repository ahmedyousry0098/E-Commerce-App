import mongoose, {Schema, model} from 'mongoose'
import { IReview } from '../../src/types/reviews.types';

const reviewSchema = new Schema<IReview>({
    rating: {type: Number, min: 1, max: 5, required: true},
    comment: {type: String, default: ""},
    createdBy: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    productId: {type: mongoose.Types.ObjectId, ref: "Product", required: true},
    orderId: {type: mongoose.Types.ObjectId, ref: "Order", required: true}
}, {
    timestamps: true
})

const ReviewModel = model<IReview>('Review', reviewSchema);

export default ReviewModel