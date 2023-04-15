import mongoose, {Schema} from 'mongoose'

const brnadSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Brand Title is required'],
        lowercase: true
    }
})