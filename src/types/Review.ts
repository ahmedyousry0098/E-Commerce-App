import mongoose from "mongoose";

export interface Review {
    rating: number;
    comment: string;
    createdBy: typeof mongoose.Types.ObjectId;
    productId: typeof mongoose.Types.ObjectId;
    orderId: typeof mongoose.Types.ObjectId;
}