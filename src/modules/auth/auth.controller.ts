import {Request,Response,NextFunction, RequestHandler} from 'express'
import UserModel from '../../../DB/models/user.model'
import { ResError } from '../../utils/errorHandling'
import { sendEmail } from '../../utils/sendEmail'
import { confirmEmailTemp } from '../../utils/templates/confirmEmailTemp'
import {generateToken, verifyToken} from '../../utils/encryption'

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
    const token = generateToken({id: user._id, email: user.email})
    return res.json({message: 'Login Successfully', token})
} 