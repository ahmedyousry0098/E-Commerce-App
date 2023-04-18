import mongoose from 'mongoose'
import { Category } from '../../src/types/Category'
import slugify from 'slugify'
import { nanoid } from 'nanoid'

const categorySchema = new mongoose.Schema<Category>({
    customId: {
        type:String, 
        default: () => nanoid(4)
    },
    title: {type: String, lowercase: true, required: true},
    slug: String,
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true}, 
    updatedBy: {type: mongoose.Types.ObjectId, ref: 'User'}, 
    image: {
        secure_url: {type:String, required: true},
        public_id: {type:String, required: true}
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

categorySchema.pre(['save'], function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, "-")
    }
    next()
})

categorySchema.virtual('sub-categories', {
    ref: 'SubCategory',
    localField: '_id',
    foreignField: 'category'
})

const CategoryModel = mongoose.model<Category>('Category', categorySchema)

export default CategoryModel