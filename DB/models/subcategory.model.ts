import mongoose, {Schema} from 'mongoose'
import { ISubCategory } from '../../src/types/subCategories.types';
import {nanoid} from 'nanoid'

const subCategorySchema = new Schema<ISubCategory>({
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
    },
    updatedBy: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
    },
}, {
    timestamps: true
})

const SubCategoryModel = mongoose.model<ISubCategory>('SubCategory', subCategorySchema)

export default SubCategoryModel;