import { Router } from 'express'
import { confirmEmail, logIn, register } from './auth.controller'
import { asyncHandler } from '../../utils/errorHandling'
import { validate } from '../../middlewares/validation'
import { registerSchema, confirmEmailSchema, loginSchema } from './auth.schema'

const router = Router()

router.post('/register', validate(registerSchema), asyncHandler(register))
router.get('/confirm-email/:token', validate(confirmEmailSchema), asyncHandler(confirmEmail))
router.post('/login', validate(loginSchema), asyncHandler(logIn))

export default router