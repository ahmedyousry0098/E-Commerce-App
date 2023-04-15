import mongoose, {Schema, model} from 'mongoose'

const brnadSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Brand Title is required'],
        lowercase: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const BrandModel = model('Brand', brnadSchema)

export default BrandModel;