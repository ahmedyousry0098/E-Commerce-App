import mongoose, {Schema, model} from 'mongoose'
import { Cart } from '../../src/types/Cart'

const cartSchema = new Schema<Cart>({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true,},
        quantity: {type: Number, default: 1, min:1}
    }]
}, {
    timestamps: true
})

const CartModel = model<Cart>('Cart', cartSchema)

export default CartModel