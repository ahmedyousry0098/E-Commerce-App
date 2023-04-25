import mongoose, {Schema, model} from 'mongoose'
import { Coupon } from '../../src/types/Coupon'

const couponSchema = new Schema<Coupon>({
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

const CouponModel = model<Coupon>('Coupon', couponSchema)

export default CouponModel