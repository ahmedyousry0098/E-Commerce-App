import {Request, Response, NextFunction, RequestHandler} from 'express'
import {nanoid} from 'nanoid'
import CategoryModel from '../../../DB/models/category.model'
import CouponModel from '../../../DB/models/coupon.model'
import SubCategoryModel from '../../../DB/models/subcategory.model'
import cloudinary from '../../utils/cloudinary'
import { ResError } from '../../utils/errorHandling'

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {title} = req.body;
    if (await CategoryModel.findOne({title})) return next(new ResError('This Category already exist!', 409))
    const customId = nanoid(4)
    const {public_id, secure_url} = await cloudinary.uploader.upload(
        `${req.file?.path}`, 
        {folder: `${process.env.APP_NAME}/Category/${customId}`}
    )
    const category = new CategoryModel({
        customId,
        title,
        image: {public_id, secure_url},
        createdBy: req.user._id,
    })

    if (! await category.save()) {
        await cloudinary.uploader.destroy(public_id)
        return next(new ResError('SomeThing Went Wrong Please Try Again', 500))
    }
    return res.status(201).json({message: 'Done', category})
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {categoryId} = req.params
    const category = await CategoryModel.findById(categoryId)
    if (!category) return next(new ResError('In-valid Category Id', 400))
    if (req.body.title) {
        if (req.body.title === category.title) return next(new ResError('Cannot Update Title With Same Name', 400))
        if (await CategoryModel.findOne({title: req.body.title})) return next(new ResError('This Category Already Exist', 409))
        category.title = req.body.title
    }
    if (req.file) {
        const {public_id, secure_url} = await cloudinary.uploader.upload(
            req.file.path, 
            {folder: `${process.env.APP_NAME}/Category/${category.customId}`}
        )
        if (!public_id || !secure_url) {
            return next(new ResError('Cannot Upload Image', 500))
        }
        if (! await cloudinary.uploader.destroy(category.image?.public_id!)) {
            return next(new ResError('Cannot Delete Old Category Image', 500))
        }
        category.image = {public_id, secure_url}
    }
    if (! await category.save()) return next(new ResError('SomeThing Went Wrong Please Try Again', 500))    
    return res.status(200).json({message: 'Updated'})
}

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryModel.find().populate([
        {
            path: 'sub-categories'
        }
    ])
    if (!categories) {
        return next(new ResError('Something Went Wrong Please Try again', 500))
    }
    if (!categories.length) {
        return res.status(200).json({message: 'No Categories Found'})
    }
    return res.status(200).json({message: 'Done', categories})
}

