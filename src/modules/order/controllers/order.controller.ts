import { Request, Response, NextFunction } from 'express'
import CouponModel from '../../../../DB/models/coupon.model'
import { ResError } from '../../../utils/errorHandling'
import { Order, ProductOrderInfo } from '../../../types/Order'
import { Coupon } from '../../../types/Coupon'
import ProductModel from '../../../../DB/models/product.model'
import OrderModel from '../../../../DB/models/order.model'
import CartModel from '../../../../DB/models/cart.model'


interface OrderRequest extends Request {
    coupon?: Coupon
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const {products, phone, adress, couponCode, paymentType} = req.body
    const userId = req.user._id
    
    // Handle Coupon
    let coupon: Coupon | undefined = undefined
    if (couponCode) {
        const checkedCoupon = await CouponModel.findOne({code: couponCode.toLowerCase(), usedBy: {$nin: userId}})
        if (!checkedCoupon || checkedCoupon.duration.to.getTime() < Date.now()) {
            return next(new ResError('In-valid Coupon Code', 404))
        } else {
            coupon = checkedCoupon
        }
    }

    // Handle Products
    // let orderd
    let productsList: ProductOrderInfo[] = []
    let subTotal = 0
    for (let product of products) {
        const checkProduct = await ProductModel.findOne({
            _id: product._id,
            stock: {$gte: product.quantity}
        })

        if (!checkProduct) {
            return next(new ResError('Please Enter valid products and Quantity', 404))
        }

        productsList.push({
            product: product._id,
            quantity: product.quantity,
            unitPrice: checkProduct.finalPrice,
            totalProductPrice: checkProduct.finalPrice * product.quantity
        })

        subTotal += checkProduct.finalPrice * product.quantity
    }

    const dummyOrder: Order = {
        user: userId,
        products: productsList,
        coupon: coupon?._id,
        checkoutPrice: (subTotal - ((subTotal * (coupon?.amount || 0)) / 100)),
        paymentType: paymentType == 'credit' ? 'credit' : 'cash',
        phone,
        adress,
        status: {
            value: paymentType == 'credit'? 'wait-payment' : 'placed',
            comment: req.body?.status?.comment
        }
    }

    if (!await OrderModel.create(dummyOrder)) {
        return next(new ResError('Cannot Create Order Please Try Again!', 500))
    }

    // decrease products stock
    for (let product of req.body.products) {
        const updatedProduct = await ProductModel.updateOne({_id: product._id}, {$inc: {stock: -parseInt(product.quantity)}})
        if (!updatedProduct.modifiedCount) 
            return next(new ResError('Something Went Wrong with decreasing products stock, please try again', 500))
    }

    // Handle Coupon 
    if (coupon) {
        const updatedCoupon = await CouponModel.updateOne({_id: coupon?._id}, {$addToSet: {usedBy: req.user._id}})
        if (!updatedCoupon.modifiedCount) 
            return next(new ResError('Something Went Wrong with Coupon, please try again', 500))
    }

    // Handle Cart
    const updatedCart = await CartModel.updateOne({user: req.user._id}, {$pull: {product: {$in: productsList.map(prod => prod.product)}}})
    if (!updatedCart.modifiedCount) 
            return next(new ResError('Something Went Wrong with Coupon, please try again', 500))

    return res.status(201).json({message: 'Done!'})
}

export const handle_side_effects = async (req: OrderRequest, res: Response, next: NextFunction) => {}
