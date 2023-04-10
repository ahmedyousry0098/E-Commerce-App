import joi, {ObjectSchema} from 'joi'
import mongoose from 'mongoose'

export interface File {
    filename: string;
    fieldname: string;
    encoding: string;
    mimetype: string;
    path: string;
    destination: string;
    originalname: string;
    size: number;
    dist?: string;
}

export interface Duration {
    month: number;
    day: number;
    hour: number;
    min: number
}

export const generalFields = {
    file: joi.object<File>({
        filename: joi.string().required(),
        fieldname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        path: joi.string().required(),
        originalname: joi.string().required(),
        destination: joi.string(),
        size: joi.number().positive().required()
    }),
    title: joi.string().regex(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/),
    email: joi.string().email({maxDomainSegments: 2}),
    Id: joi.string().custom((value) => {
        return mongoose.Types.ObjectId.isValid(value) ? true : false
    }),
    duration: joi.object<Duration>({
        month: joi.number().positive().min(0).max(12),
        day: joi.number().positive().min(0).max(31),
        hour: joi.number().positive().min(0).max(24),
        min: joi.number().positive().min(0).max(60),
    })
}