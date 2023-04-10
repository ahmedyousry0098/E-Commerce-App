import mongoose, {Schema, model} from 'mongoose'

const couponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    expirationDate: {
        from: {type: Date, default: Date.now()},
        to: {type: Date, required: true}
    },
    status: {
        type: String,
        enum: ['Valid', 'Expired'],
        default: 'Valid'
    },
    usedBy: [{type: mongoose.Types.ObjectId, ref: 'User'}],
}, {
    timestamps: true
})

const CouponModel = mongoose.models.Coupon || model('Coupon', couponSchema)

export default CouponModel