import mongoose, {Schema, model} from 'mongoose'
import { ICoupon } from '../../src/types/coupon.type'

const couponSchema = new Schema<ICoupon>({
    code: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true
    },
    duration: {
        from: {type: Date, default: Date.now(), required: true},
        to: {type: Date, required: true}
    },
    status: {
        type: String,
        enum: ['Valid', 'Expired'],
        default: 'Valid',
    },
    usedBy: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const CouponModel = model<ICoupon>('Coupon', couponSchema)

export default CouponModel