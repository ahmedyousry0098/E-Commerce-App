import { Request, Response, NextFunction, RequestHandler } from 'express'
import CategoryModel from '../../../DB/models/category.model'
import SubCategoryModel from '../../../DB/models/subcategory.model'
import cloudinary from '../../utils/cloudinary'
import { ResError } from '../../utils/errorHandling'
import { nanoid } from 'nanoid'

export const addSubCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {categoryId} = req.params
    const {title} = req.body
    const category = await CategoryModel.findById(categoryId)
    if (!category) return next(new ResError('Parent Category Is Not Exist', 400))
    const subCategory = await SubCategoryModel.findOne({title})
    if (subCategory) {
        return next(new ResError('Sub-Category Already Exist', 400))
    }
    const customId = nanoid(4)
    const {public_id, secure_url} = await cloudinary.uploader.upload(
        `${req.file?.path}`, 
        {folder: `${process.env.APP_NAME}/category/${category.customId}/${customId}`}
    )
    
    if (!public_id || !secure_url) {
        return next(new ResError('SomeThing Went Wrong Please Try Again', 500))
    }
    const newSubCategory = new SubCategoryModel({
        title,
        image: {public_id, secure_url},
        category: categoryId,
        customId
    })

    if (! await newSubCategory.save()){
        await cloudinary.uploader.destroy(public_id)
        return next(new ResError('Cannot Save SubCategory', 500))
    }
    return res.status(201).json({message: 'Done'})
}

export const updateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {categoryId, subCategoryId} = req.params
    const subCategory = await SubCategoryModel.findOne({_id: subCategoryId, category: categoryId}).populate([
        {
            path: 'category',
            select: 'customId'
        }
    ])
    if (!subCategory) {
        return next(new ResError('In-valid Cantegory OR Sub-Category id', 400))
    }
    if (req.body.title) {
        const {title} = req.body
        if (subCategory.title === title) return next(new ResError('Cannot Update Title With Same Name', 400))
        if (await SubCategoryModel.findOne({title: title})) return next(new ResError('Sub-Category Already Exist', 400))
        subCategory.title = title
    }
    if (req.file) {
        const {public_id, secure_url} = await cloudinary.uploader.upload(
            req.file.path, 
            {folder: `${process.env.APP_NAME}/category/${subCategory.category.customId}/sub-category/${subCategory.customId}`}
        )
        if (!public_id || !secure_url) {
            return next(new ResError('Cannot Upload New Picture', 500))
        }
        if (! await cloudinary.uploader.destroy(subCategory.image.public_id)) {
            return next(new ResError('Cannot Delete Old Picture Form Cloud', 500))
        }
        subCategory.image = {public_id, secure_url}
    }
    return ! await subCategory.save() 
        ? next(new ResError('Cannot Save Changes, Please Try Again', 500))
        : res.status(200).json({message: 'Done'})
} 