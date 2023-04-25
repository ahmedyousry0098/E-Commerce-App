import mongoose from "mongoose"

export interface Cart {
    user: typeof mongoose.Types.ObjectId
    products: {
        productId: typeof mongoose.Types.ObjectId
        quantity: number
    } []
}