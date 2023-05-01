import { Request, Response, NextFunction } from 'express'
import UserModel from '../../DB/models/user.model'
import {verifyToken} from '../utils/encryption'
import { ResError, asyncHandler } from '../utils/errorHandling'

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers
    if (!authorization?.startsWith(process.env.TOKEN_PREFIX!)) {
        return next(new ResError('In-valid authorization key', 400))
    }
    const token = authorization.replace(process.env.TOKEN_PREFIX!, '')
    const decoded = verifyToken(token, process.env.TOKEN_SIGNATURE)
    if (!decoded?.id) {
        return next(new ResError('In-valid authorization key', 400)) 
    }

    const user = await UserModel.findById(decoded.id).select('userName email role lastChangePasswordTime')
    if (!user) {
        return next(new ResError('Not Registerd Account', 401))
    }

    if (new Date(decoded.iat * 1000) < user.lastChangePasswordTime) {
        return next(new ResError('Session Expired', 401))
    }

    req.user = user
    next()
})