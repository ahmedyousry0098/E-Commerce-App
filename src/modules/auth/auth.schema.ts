import joi from 'joi'
import {User} from '../../../DB/models/user.model'
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