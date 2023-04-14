import mongoose, {Schema} from 'mongoose'
import { SubCategory } from '../../src/types/SubCategory';
import {nanoid} from 'nanoid'

const subCategorySchema = new Schema<SubCategory>({
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
    },
    createdBy: {
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
}, {
    timestamps: true
})

const SubCategoryModel = mongoose.model<SubCategory>('SubCategory', subCategorySchema)

export default SubCategoryModel;