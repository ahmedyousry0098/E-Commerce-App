import mongoose, {Schema, model} from 'mongoose'
import { Review } from '../../src/types/Review';

const reviewSchema = new Schema<Review>({
    rating: {type: Number, min: 1, max: 5, required: true},
    comment: {type: String, default: ""},
    createdBy: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    productId: {type: mongoose.Types.ObjectId, ref: "Product", required: true},
    orderId: {type: mongoose.Types.ObjectId, ref: "Order", required: true}
}, {
    timestamps: true
})

const ReviewModel = model<Review>('Review', reviewSchema);

export default ReviewModel