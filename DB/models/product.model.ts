import mongoose, {Schema, model, mongo} from 'mongoose'
import { IProduct } from '../../src/types/product.types'
import slugify from 'slugify'
import { nanoid } from 'nanoid'
import cloudinary from '../../src/utils/cloudinary'

const productSchema = new Schema<IProduct>({
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
    finalPrice: {type:Number},
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
    wishList: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    updatedBy: {type: mongoose.Types.ObjectId, ref: 'User'}
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
})

productSchema.pre('save', function(next){
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            replacement: '-',
            lower: true
        })
    }
    if (this.isModified(['price', 'discount'])) { // Check
        const [price, discount] = [this.price, this.discount]
        this.finalPrice = price - (price * (discount/100))
    }
    next()
})

productSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})

const ProductModel = model<IProduct>('Product', productSchema)

export default ProductModel