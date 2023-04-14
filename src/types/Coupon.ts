import mongoose from "mongoose";

export interface Coupon {
    code: string;
    amount: number;
    expirationDate: {
        from: Date;
        to: Date
    };
    status: string;
    usedBy: (typeof mongoose.Types.ObjectId) [];
    createdBy: typeof mongoose.Types.ObjectId
} 