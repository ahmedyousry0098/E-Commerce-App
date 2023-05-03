import mongoose from "mongoose";

export interface IReview {
    rating: number;
    comment: string;
    createdBy: typeof mongoose.Types.ObjectId;
    productId: typeof mongoose.Types.ObjectId;
    orderId: typeof mongoose.Types.ObjectId;
}