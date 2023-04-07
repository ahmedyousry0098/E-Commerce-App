import { log } from 'console'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export const addSubCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    log(req.params)
    return res.status(200).json({message: 'Done'})
}