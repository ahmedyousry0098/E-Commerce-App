import {Request,Response,NextFunction, RequestHandler} from 'express'
import UserModel from '../../../DB/models/user.model'
import { ResError } from '../../utils/errorHandling'
import { sendEmail } from '../../utils/sendEmail'
import { confirmEmailTemp } from '../../utils/templates/confirmEmailTemp'
import { forgetPasswordTemp } from '../../utils/templates/forgetPasswordTemp'
import {generateToken, verifyToken} from '../../utils/encryption'
import {customAlphabet} from 'nanoid'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const {userName, email, password, gender, phone} = req.body
    if (await UserModel.findOne({email})) {
        return next(new ResError('Email Already Exist', 409))
    }
    const user = new UserModel({
        userName,
        email, 
        password,
        gender,
        phone,
    })

    const token = generateToken({id: user._id, email: user.email})
    const confirmationLink: string = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/confirm-email/${token}`
    const emailInfo = await sendEmail({
        to: email,
        subject: 'Confirm Your Email',
        html: confirmEmailTemp(confirmationLink)
    })

    if (!emailInfo.accepted.length) {
        return next(new ResError('Failed to send email', 503))
    }

    return await user.save() 
        ? res.status(201).json({message: 'Done'})
        : next(new ResError('Something Went wrong please try again', 500))
}

export const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const {token} = req.params
    const decoded = verifyToken(token)
    const user = await UserModel.findByIdAndUpdate(decoded.id, {isConfirmed: true})
    if (!user) {
        return next(new ResError('User Not Found', 404))
    }
    return res.status(200).json({message: 'Confirmed'})
}

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    if (!user) 
        return next(new ResError('In-valid LogIn Informations', 400))
    if (!user.comparePassword(password)) 
        return next(new ResError('In-valid LogIn Informations', 400))
    if (!user.isConfirmed)
        return next(new ResError('Please Confirm Your Email First', 403))
    if (user.status === 'deleted')
        return next(new ResError('Account has been deleted, Try to sign up again', 404))
    if (user.status === 'blocked')
        return next(new ResError('Sorry this account has been blocked', 403))
    const token = generateToken({id: user._id, email: user.email})
    return res.json({message: 'Login Successfully', token})
} 

export const requestForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body
    const resetCode = customAlphabet('123456789', 4)
    const user = await UserModel.findOneAndUpdate({email}, {resetCode: resetCode()}, {new: true})
    if (!user) {
        return next(new ResError('Not Registered User', 401))
    }
    const emailInfo = await sendEmail({
        to: email, 
        subject: 'Reset Password Code', 
        html: forgetPasswordTemp(`${user.resetCode}`)
    })
    if (!emailInfo.accepted.length) {
        return next(new ResError('Cannot Send Email, Please Try Again', 503))
    }
    return res.status(200).json({message: 'Check email inbox'})
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const {email, resetCode, password} = req.body
    const user = await UserModel.findOne({email})
    if (!user) return next(new ResError('Not Registered User', 401))
    if (user.resetCode !== resetCode) return next(new ResError('In-valid Code, Please Check Your Email To input the valid Code', 400))
    user.password = password
    user.resetCode = undefined
    if (! await user.save()) {
        return next(new ResError('Something Went Wrong Please Try Again', 500))
    }
    return res.status(200).json({message: 'Password Updated Successfully'})
}