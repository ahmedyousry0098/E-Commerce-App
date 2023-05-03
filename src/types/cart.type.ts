import mongoose from "mongoose"

export interface ICart {
    user: typeof mongoose.Types.ObjectId
    products: {
        productId: typeof mongoose.Types.ObjectId
        quantity: number
    } []
}