import { Request, Response, NextFunction } from 'express'
import joi, {ObjectSchema, ValidationResult} from 'joi'

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const reqKeys = {...req.body, ...req.params, ...req.query}
        if (req.file || req.files) {
            reqKeys.file = req.file || req.files;
        }

        const result: ValidationResult = schema.validate(reqKeys, {abortEarly: false})

        if (result.error?.details) {
            const messages: string[] = []
            for (let err of result.error.details) {
                messages.push(err.message)
            }
            return res.status(400).json({message: 'validation error', details: messages})
        }
        next()
    }
}

