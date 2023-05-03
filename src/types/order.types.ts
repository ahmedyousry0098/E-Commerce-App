import mongoose from "mongoose";
import { Address, ProductOrderInfo } from "./general.types";

export interface IOrder {
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