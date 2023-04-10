import mongoose, {Schema} from 'mongoose'
import {nanoid} from 'nanoid'

const subCategorySchema = new Schema({
    customId: {type: String, default: () => nanoid(4)},
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        public_id: {type: String, required: true},
        secure_url: {type: String, required: true}
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
})

const SubCategoryModel = mongoose.models.SubCategoryModel || mongoose.model('SubCategory', subCategorySchema)

export default SubCategoryModel;