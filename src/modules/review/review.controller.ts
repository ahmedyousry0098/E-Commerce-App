import { Request, Response, NextFunction } from 'express'
import ReviewModel from '../../../DB/models/reviews.model'
import OrderModel from '../../../DB/models/order.model'
import { ResError } from '../../utils/errorHandling'

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params
    const userId = req.user._id
    const {comment, rating} = req.body
    // Check if Product Ordered Before
    const order = await OrderModel.findOne({
        user: userId,
        status: {value: 'delivered'},
        "products.productId": productId
    })

    if (!order) return next(new ResError('Cannot review product before buy and receive it', 400))

    const oldReview = await ReviewModel.findOne({createdBy: userId, productId})
    if (!oldReview) {
        const newReview = await ReviewModel.create({
            comment,
            rating,
            orderId: order._id,
            productId,
            createdBy: userId
        })
        return !newReview 
            ? next(new ResError('Something Went Wrong Please Try Again', 500))
            : res.status(201).json({message: 'Reviewed Successfully'})
    } else {
        oldReview.comment = comment
        oldReview.rating = rating
        if (!await oldReview.save()) return next(new ResError('Something Went Wrong Please Try Again', 500))
        return res.status(200).json({message: 'Review Updated Successfully'})
    }
}