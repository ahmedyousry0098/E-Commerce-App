import { Router } from 'express'
import { confirmEmail, logIn, register, requestForgetPassword, resetPassword } from './auth.controller'
import { asyncHandler } from '../../utils/errorHandling'
import { validate } from '../../middlewares/validation'
import { registerSchema, confirmEmailSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema } from './auth.validation'

const router = Router()

router.post('/register', validate(registerSchema), asyncHandler(register))
router.get('/confirm-email/:token', validate(confirmEmailSchema), asyncHandler(confirmEmail))
router.post('/login', validate(loginSchema), asyncHandler(logIn))
router.patch('/forget-password', validate(forgetPasswordSchema), asyncHandler(requestForgetPassword))
router.patch('/reset-password', validate(resetPasswordSchema), asyncHandler(resetPassword))

export default router