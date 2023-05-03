import mongoose from "mongoose";

export type Image = {
    secure_url: string;
    public_id: string
}

export type Address = {
    apartment: string,
    building: string,
    street: string,
    city: string,
    country?: string
};

export type ProductOrderInfo = {
    name: string
    productId: typeof mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    totalProductPrice: number;
}

export type File = {
    filename: string;
    fieldname: string;
    encoding: string;
    mimetype: string;
    path: string;
    destination: string;
    originalname: string;
    size: number;
    dist?: string;
}

export type Duration = {
    from?: Date;
    to: Date
}