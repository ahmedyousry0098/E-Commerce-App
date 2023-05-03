import mongoose, {Schema, model} from 'mongoose'
import { IOrder } from '../../src/types/order.types'

const orderSchema = new Schema<IOrder>({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    products: [{
        name: {type: String, required: true},
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
    address: {
        apartment: {type: String, required: true},
        building: {type: String, required: true},
        street: {type: String, required: true},
        city: {type: String, required: true},
        country: {type:String, default: 'egypt'}
    },
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

const OrderModel = model<IOrder>('Order', orderSchema)

export default OrderModel
