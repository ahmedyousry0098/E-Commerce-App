import {Request, Response, NextFunction, RequestHandler} from 'express'
import slugify from 'slugify';
import CategoryModel from '../../../DB/models/category.model'
import cloudinary from '../../utils/cloudinary'
import { ResError } from '../../utils/errorHandling'

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {title} = req.body;
    if (await CategoryModel.findOne({title})) return next(new ResError('This Category already exist!', 409))
    const {public_id, secure_url} = await cloudinary.uploader.upload(`${req.file?.path}`, {folder: `E_Commerce/Categories`})
    const category = new CategoryModel({
        title,
        image: {public_id, secure_url}
    })

    if (! await category.save()) return next(new ResError('SomeThing Went Wrong Please Try Again', 500))
    return res.status(201).json({message: 'Done', category})
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {categoryId} = req.params
    const category = await CategoryModel.findById(categoryId)
    if (!category) return next(new ResError('In-valid Category Id', 400))
    if (req.body.title) {
        if (req.body.title === category.title) return next(new ResError('Cannot Update Title With Same Title Name', 400))
        if (await CategoryModel.findOne({title: req.body.title})) return next(new ResError('This Category Already Exist', 400))
        category.title = req.body.title
    }
    if (req.file) {
        const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {folder: `E_Commerce/categories`}) // : Check If Process Successed Or Not
        if (! await cloudinary.uploader.destroy(category.image?.public_id!)) {
            return next(new ResError('Cannot Delete Old Category Image', 500))
        }
        category.image = {public_id, secure_url}
    }
    if (! await category.save()) return next(new ResError('SomeThing Went Wrong Please Try Again', 500))    
    return res.status(200).json({message: 'Updated'})
}

