import mongoose from "mongoose";

export type ProductOrderInfo = {
    name: string
    productId: typeof mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    totalProductPrice: number;
}

export type Address = {
    apartment: string,
    building: string,
    street: string,
    city: string,
    country?: string
};

export interface Order {
    user: typeof mongoose.Types.ObjectId;
    products: ProductOrderInfo[];
    couponId?: typeof mongoose.Types.ObjectId;
    checkoutPrice: number;
    paymentType: string;
    phone: string[];
    address: Address;
    status: {
        value: string;
        comment?: string
    };
    createdAt?: Date
}