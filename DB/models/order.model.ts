import mongoose, {Schema, model} from 'mongoose'
import { Order } from '../../src/types/Order'

const orderSchema = new Schema<Order>({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    products: [{
        productId: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, required: true},
        unitPrice: {type: Number, required: true},
        totalProductPrice: {type: Number}
    }],
    couponId: {type: mongoose.Types.ObjectId, ref: 'Coupon'},
    checkoutPrice: {type: Number, required: true},
    paymentType: {
        type: String,
        enum: ['cash', 'credit'],
        default: 'cash'
    },
    phone: [{type:String, required: true}],
    adress: {type: String, required: true},
    status: {
        value: {
            type: String,
            enum: ['delivered', 'on-way', 'placed', 'canceled', 'rejected', 'wait-payment'],
            default: 'placed'
        },
        comment: String
    }
}, {
    timestamps: true
})

const OrderModel = model('Order', orderSchema)

export default OrderModel
