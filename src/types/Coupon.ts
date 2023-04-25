import mongoose from "mongoose";

export interface Coupon {
    _id: typeof mongoose.Types.ObjectId,
    code: string;
    amount: number;
    duration: {
        from: Date;
        to: Date
    };
    status: string;
    usedBy: (typeof mongoose.Types.ObjectId) [];
    createdBy: typeof mongoose.Types.ObjectId;
    updatedBy: typeof mongoose.Types.ObjectId;
} 