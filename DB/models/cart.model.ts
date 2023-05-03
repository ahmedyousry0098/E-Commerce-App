import mongoose, {Schema, model} from 'mongoose'
import { ICart } from '../../src/types/cart.type'

const cartSchema = new Schema<ICart>({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    products: [{
        productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true,},
        quantity: {type: Number, default: 1, min:1}
    }]
}, {
    timestamps: true
})

const CartModel = model<ICart>('Cart', cartSchema)

export default CartModel