import { Request, Response, NextFunction } from 'express'
import CouponModel from '../../../DB/models/coupon.model'
import { ResError } from '../../utils/errorHandling'
import moment from 'moment'

export const addCoupon = async (req: Request, res: Response, next: NextFunction) => {
    const {code, amount, duration: {month, week, day, hour}} = req.body
    if (await CouponModel.findOne({code})) return next(new ResError('Coupon Already Exist', 409))
    const expirationDate = moment()
        .add(month, 'month')
        .add(week, 'week')
        .add(day, 'day')
        .add(hour, 'hour')
        .format('YYYY-MM-DD HH:MM')
    const coupon = await CouponModel.create({
        code,
        amount,
        expirationDate: {
            from: moment().format('YYYY-MM-DD HH:MM'),
            to: expirationDate
        },
        createdBy: req.user._id
    })
    return !coupon 
        ? next(new ResError('Something Went Wrong Please Try Again', 500))
        : res.status(201).json({message: 'Done'})
}

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    const {couponId} = req.params
    if (!Object.keys(req.body).length){
        return next(new ResError('Please Enter Data Which You need To Update', 400))
    }
    const coupon = await CouponModel.findByIdAndUpdate(couponId, req.body, {new: true})
     return !coupon 
        ? next(new ResError('Coupon Not Found', 400))
        : res.status(200).json({message: 'Updated Successfully'})
}
