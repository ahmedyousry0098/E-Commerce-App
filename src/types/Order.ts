import mongoose from "mongoose";

export type ProductOrderInfo = {
    productId: typeof mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    totalProductPrice: number;
}

export interface Order {
    user: typeof mongoose.Types.ObjectId;
    products: ProductOrderInfo[];
    coupon?: typeof mongoose.Types.ObjectId;
    checkoutPrice: number;
    paymentType: string;
    phone: string[];
    adress: string;
    status: {
        value: string;
        comment?: string
    }
}