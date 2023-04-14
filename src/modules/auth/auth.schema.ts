import joi from 'joi'
import {User} from '../../types/User'
import { generalFields } from '../../constants/validation.general'

interface Register extends User {
    confirmationPassword: string;
}

interface Login {
    email: string;
    password: string;
}

interface ConfirmEmail {
    token: string
}

interface ForgetPassword {
    email: string;
}

interface ResetPassword extends ForgetPassword {
    resetCode: string;
    password: string;
    confirmationPassword: string;
}

export const registerSchema = joi.object<Register>({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmationPassword: joi.string().valid(joi.ref('password')).required(),
    gender: joi.string().valid('male', 'female').required(),
    phone: generalFields.phone.required(),
}).required()

export const confirmEmailSchema = joi.object<ConfirmEmail>({
    token: joi.string()
}).required()

export const loginSchema = joi.object<Login>({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
}).required()

export const forgetPasswordSchema = joi.object<ForgetPassword>({
    email: generalFields.email.required()
}).required()

export const resetPasswordSchema = joi.object<ResetPassword>({
    email: generalFields.email.required(),
    resetCode: joi.string().pattern(new RegExp(/^[1-9]{4}$/)).required(),
    password: generalFields.password.required(),
    confirmationPassword: joi.string().valid(joi.ref('password')).required()
}).required()