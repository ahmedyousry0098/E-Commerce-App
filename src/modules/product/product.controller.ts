import { Request, Response, NextFunction } from 'express'
import ProductModel from '../../../DB/models/product.model'
import CategoryModel from '../../../DB/models/category.model'
import SubCategoryModel from '../../../DB/models/subcategory.model'
import BrandModel from '../../../DB/models/brand.model'
import { ResError } from '../../utils/errorHandling'
import { nanoid } from 'nanoid'
import cloudinary from '../../utils/cloudinary'
import { Image } from '../../types/general'

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {categoryId, subCategoryId, brandId} = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } 
    if (!await SubCategoryModel.findOne({_id: subCategoryId, category: categoryId})) {
        return next(new ResError('In-valid Category OR Subcategory Id', 400))
    }
    // if (!await BrandModel.findById(brandId)) {
    //     return next(new ResError('In-valid Brand Id', 400))
    // }
    const customId = nanoid()
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        files.mainImg[0].path, 
        {folder: `${process.env.APP_NAME}/product/${customId}`}
    )
    let subImgsList: Image[] = []
    if (files.subImgs) {
        for (let img of files.subImgs) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(
                img.path, 
                {folder: `${process.env.APP_NAME}/product/${customId}/subImgs`}
            )
            subImgsList.push({secure_url, public_id})
        }
    }
    const product = new ProductModel({
        ...req.body, 
        customId,
        createdBy: req.user._id,
        mainImg: {secure_url, public_id},
        subImgsList
    })
    if (! await product.save()) {
        const subImgsIds = subImgsList.map(Img => Img.public_id)
        await cloudinary.api.delete_resources([public_id, ...subImgsIds])
        return next(new ResError('Something went wrong, pleas try to add product again', 500))
    }
    return res.status(201).json({message: 'Done'})
}
