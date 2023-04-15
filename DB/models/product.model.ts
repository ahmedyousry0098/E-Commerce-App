import mongoose, {Schema, model} from 'mongoose'
import { Product } from '../../src/types/Product'
import slugify from 'slugify'
import { nanoid } from 'nanoid'

const productSchema = new Schema<Product>({
    customId: {type:String, default: () => nanoid()},
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: String,
    stock: {type: Number, default: 1},
    price: {type: Number, required: true},
    discount: {type: Number, default: 0},
    color: [String],
    size: {
        type: [String],
        enum: ['s', 'm', 'l', 'xl', 'xxl']
    },
    categoryId: {type: mongoose.Types.ObjectId, ref:'Category', required: true},
    subCategoryId: {type: mongoose.Types.ObjectId, ref:'SubCategory', required: true},
    brandId: {type: mongoose.Types.ObjectId, ref: 'Brand'},

    mainImg: {
        secure_url: {type: String, required: true},
        public_id: {type: String, required: true},
    },
    subImgs: [{secure_url:String, public_id:String}],
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    updatedBy: {type: mongoose.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

productSchema.pre('save', function(next){
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            replacement: '-',
            lower: true
        })
    }
    next()
})

productSchema.virtual('finalPrice').get(function() {
    let [price, discount] = [this.price, this.discount]
    const final_price: number = price - ( price * (discount/100))
    return final_price
})

const ProductModel = model<Product>('Product', productSchema)

export default ProductModel