import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: String,
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: false}, // Would Modified Later
    image: {
        secure_url: {type:String, required: true},
        public_id: {type:String, required: true}
    },
}, {
    timestamps: true
})

categorySchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, "-")
    }
    next()
})

const CategoryModel = mongoose.model('Category', categorySchema)

export default CategoryModel