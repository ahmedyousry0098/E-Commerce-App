import { Request, Response, NextFunction } from 'express'
import CartModel from '../../../DB/models/cart.model'
import ProductModel from '../../../DB/models/product.model'
import { ResError } from '../../utils/errorHandling'

export const addCart = async (req:Request, res:Response, next:NextFunction) => {
    const {productId, quantity} = req.body
    const userId = req.user._id
    const product = await ProductModel.findById(productId)
    if (!product) {
        return next(new ResError('In-valid Product Id', 400))
    }
    if (product.stock < quantity) {
        await ProductModel.findByIdAndUpdate(productId, {
            $addToSet: {wishList: userId}
        })
        return next(new ResError(`Sorry, Only ${product.stock} product is available now`, 404))
    }
    const cart = await CartModel.findOne({user: userId})
    if (!cart) {
        // create it
        const initCart = await CartModel.create({
            user: userId,
            products: {
                productId,
                quantity
            }
        })
        if (!initCart) return next(new ResError('Cannot Initiate Cart, Please Try Again', 500))
        return res.status(201).json({message: 'Done'})
    }

    // update Quantity | Push new
    
    let isProductExist = false
    for (let product of cart.products) {
        if (product.productId.toString() === productId) {
            product.quantity = quantity
            isProductExist = true
            break;
        }
    }
    
    if (!isProductExist) {
        cart.products.push({productId, quantity})
    }

    if (! await cart.save())
        return next(new ResError('Cannot Save Changes', 500))

    return res.status(200).json({message: 'Done'})
}