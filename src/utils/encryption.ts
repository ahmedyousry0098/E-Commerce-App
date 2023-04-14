import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

interface TokenPayload {
    id: mongoose.Types.ObjectId,
    email?: string
}

interface TokenDecoded extends TokenPayload {
    iat: number
}

export const generateToken = (
    payload: TokenPayload, 
    signature: string = process.env.TOKEN_SIGNATURE!,
    expiresIn: number = 60*60,
    ): string => {
        const token = jwt.sign(payload, signature, {expiresIn})
        return token
    }


export const verifyToken = (token: string, signature: string = process.env.TOKEN_SIGNATURE!) => {
    const decoded = jwt.verify(token, signature) as TokenDecoded
    return decoded
}

export const hash = (payload: string) => {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))
    const hashed = bcrypt.hashSync(payload, salt)
    return hashed
}

export const compareHash = (plainText: string, hashed: string) => {
    return bcrypt.compareSync(plainText, hashed)
}