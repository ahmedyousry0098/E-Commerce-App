import { Request, Response, NextFunction } from 'express'
import CouponModel from '../../../DB/models/coupon.model'
import { ResError } from '../../utils/errorHandling'
import { IOrder } from '../../types/order.types'
import { ICoupon } from '../../types/coupon.type'
import ProductModel from '../../../DB/models/product.model'
import OrderModel from '../../../DB/models/order.model'
import CartModel from '../../../DB/models/cart.model'
import createInvoice from '../../utils/templates/invoicePDF'
import { sendEmail } from '../../utils/sendEmail'
import path from 'path'
import { ProductOrderInfo } from '../../types/general.types'

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const {products, phone, address: {apartment, building, street, city}, couponId, paymentType} = req.body
    const userId = req.user._id
    
    // Handle Coupon
    let coupon: ICoupon | undefined = undefined
    if (couponId) {
        const checkedCoupon = await CouponModel.findOne({_id: couponId, usedBy: {$nin: userId}})
        if (!checkedCoupon || checkedCoupon.duration.to.getTime() < Date.now()) {
            return next(new ResError('In-valid Coupon Code', 404))
        } else {
            coupon = checkedCoupon
        }
    }

    // Handle Products
    let productsList: ProductOrderInfo[] = []
    let subTotal = 0
    for (let product of products) {
        const checkProduct = await ProductModel.findOne({
            _id: product.productId,
            stock: {$gte: product.quantity}
        })

        if (!checkProduct) {
            return next(new ResError('Please Enter valid products and Quantity', 404))
        }

        productsList.push({
            name: checkProduct.name,
            productId: product.productId,
            quantity: product.quantity,
            unitPrice: checkProduct.finalPrice,
            totalProductPrice: checkProduct.finalPrice * product.quantity
        })

        subTotal += checkProduct.finalPrice * product.quantity
    }

    const dummyOrder: IOrder = {
        user: userId,
        products: productsList,
        couponId,
        checkoutPrice: (subTotal - ((subTotal * (coupon?.amount || 0)) / 100)),
        paymentType: paymentType == 'credit' ? 'credit' : 'cash',
        phone,
        address: {
            apartment, 
            building, 
            street, 
            city
        },
        status: {
            value: paymentType == 'credit'? 'wait-payment' : 'placed',
            comment: req.body?.status?.comment
        }
    }

    const order = await OrderModel.create(dummyOrder)
    if (!order) {
        return next(new ResError('Cannot Create Order Please Try Again!', 500))
    }

    // decrease products stock
    for (let product of req.body.products) {
        const updatedProduct = await ProductModel.updateOne({_id: product.productId}, {$inc: {stock: -parseInt(product.quantity)}})
        if (!updatedProduct.modifiedCount) 
            return next(new ResError('Something Went Wrong with decreasing products stock, please try again', 500))
    }

    // Handle Coupon 
    if (couponId) {
        const updatedCoupon = await CouponModel.updateOne({_id: coupon?._id}, {$addToSet: {usedBy: req.user._id}})
        if (!updatedCoupon.modifiedCount){ 
            for (let product of req.body.products) {
                await ProductModel.findByIdAndUpdate(product.productId, {$inc: {stock: parseInt(product.quantity)}})
            }
            return next(new ResError('Something Went Wrong with Coupon, please try again', 500))
        }
    }

    // Handle Cart
    await CartModel.updateOne({user: req.user._id}, {$pull: {product: {$in: productsList.map(prod => prod.productId)}}})

    const invoice = {
        shipping: {
          name: req.user.userName.toLocaleUpperCase(),
          apartment: order.address.apartment,
          building: order.address.building,
          city: order.address.city,
          country: order.address.country || 'egypt',
        },
        date: order.createdAt || new Date(),
        items: order.products,
        subTotal,
        paid: order.checkoutPrice,
        invoice_nr: order._id
    };
      
    await createInvoice(invoice, `${path.join(path.resolve(), './src/assets')}/invoice.pdf`)

    await sendEmail({
        to: req.user.email,
        html: '', 
        subject: 'Invoice', 
        attachment: [{path: path.join(path.resolve(), './src/assets/invoice.pdf')}], 
    })

    return res.status(201).json({message: 'Done!', order})
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const {orderId} = req.params
    const {comment} = req.body
    const userId = req.user._id
    const order = await OrderModel.findOne({_id: orderId, user: userId})
    if (!order) return next(new ResError('In-valid Order Id', 404))

    if (
        order.paymentType == 'cash' && order.status.value !== 'placed' || 
        order.paymentType == 'credit' && order.status.value !== 'wait-payment'
    ) {
        return next(new ResError(`Cannot Cancel Order While it\'s Status ${order.status.value}`, 403))
    }

    if (order.user.toString() !== userId.toString()) return next(new ResError('Sorry, You Don\'t have permissions To do that', 406))
    
    order.status.value = 'canceled'
    order.status.comment = comment
    if (! await order.save()) return next(new ResError('Something Went Wrong Please Try Again', 500))
    return res.status(200).json({message: 'Done'})
}
