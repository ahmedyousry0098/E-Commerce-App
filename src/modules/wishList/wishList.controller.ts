import {Request, Response, NextFunction} from 'express'
import UserModel from '../../../DB/models/user.model'
import ProductModel from '../../../DB/models/product.model'
import { ResError } from '../../utils/errorHandling'

export const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params
    const userId = req.user._id
    if (!await ProductModel.findById(productId)) {
        return next(new ResError('In-valid Product Id', 404))
    }
    const wishList = await UserModel.updateOne({_id: userId}, {$addToSet: {wishList: productId}})
    if (!wishList.modifiedCount) {
        return next(new ResError('Something Went Wrong Please Try Again', 500))
    }
    return res.status(200).json({message: 'Added To Wish List'})
}

export const removeFromWishList = async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params
    const userId = req.user._id
    if (!await ProductModel.findById(productId)) {
        return next(new ResError('In-valid Product Id', 404))
    }
    const wishList = await UserModel.updateOne({_id: userId}, {$pull: {wishList: productId}})
    if (!wishList.modifiedCount) {
        return next(new ResError('Something Went Wrong Please Try Again', 500))
    }
    return res.status(200).json({message: 'Item Removed From Wish List'})
}