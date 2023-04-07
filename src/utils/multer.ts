import express, {Request} from 'express'
import multer, {FileFilterCallback, Multer, StorageEngine} from 'multer'

export const validation = {
    image: ['image/png', 'image/jpg', 'image/jpeg']
}

export const uploadFile = (validation: string[]): Multer => {
    const storage: StorageEngine = multer.diskStorage({})
    
    function fileFilter (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        if (!validation.includes(file.mimetype)) {
            cb(null, false)
        } else {
            cb(null, true)
        }
    }

    return multer({fileFilter, storage})
}