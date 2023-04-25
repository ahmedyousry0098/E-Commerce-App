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
    from?: Date;
    to: Date
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
    duration: joi.object<Duration>({
        from: joi.date().greater(Date.now()).required(),
        to: joi.date().greater(joi.ref('from')).required()
    }),
    Id: joi.string().custom((value) => {
        return mongoose.Types.ObjectId.isValid(value) ? true : false
    }),
    title: joi.string().regex(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/),
    userName: joi.string().regex(/[A-Za-z]{3,15}(?: [A-Za-z]{3,15}){1,2}$/),
    email: joi.string().email({maxDomainSegments: 2}),
    password: joi.string().regex(/^[A-Za-z0-9-_@$]{4,30}$/),
    phone: joi.string().regex(/^(\+2|002)?(01[0125])[0-9]{8}$/)
}