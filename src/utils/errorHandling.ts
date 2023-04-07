import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export class ResError extends Error {
    code:number
    constructor (message:(string | undefined), code?:number) {
        super(message)
        this.code = code || 500
    }
}

export const asyncHandler = (API: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        API(req, res, next).catch((err:ResError) => next(new ResError(err.message, err.code)))
    }
}

export const globalErrorHandling: ErrorRequestHandler = (err, req, res, next) => {
    return process.env.MODE === 'dev' 
        ? res.status(err.code).json({message: err.message, stack: err.stack})
        : res.status(err.code).json({message: err.message})
}
