import { Request, Response, NextFunction, RequestHandler } from 'express'
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
        subImgs: subImgsList
    })
    if (! await product.save()) {
        const subImgsIds = subImgsList.map(Img => Img.public_id)
        await cloudinary.api.delete_resources([public_id, ...subImgsIds])
        return next(new ResError('Something went wrong, pleas try to add product again', 500))
    }
    return res.status(201).json({message: 'Done'})
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body 
    const {productId} = req.params;
    const product = await ProductModel.findById(productId)
    if (!product) {
        return next(new ResError('In-valid Product Id', 404))
    }
    // update product sub-category
    if (req.body.subCategoryId) {
        if (await SubCategoryModel.findById(req.body.subCategoryId)) {
            product.subCategoryId = req.body.subCategoryId
        }
    }
    // update product brand
    if (req.body.brandId) {
        if (await BrandModel.findById(req.body.brandId)) {
            product.brandId = req.body.brandId
        }
    }

    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } 
        if (files.mainImg) { // .length ?
            const {secure_url, public_id} = await cloudinary.uploader.upload(
                files.mainImg[0].path,
                {folder: `${process.env.APP_NAME}/product/${product.customId}`}
            )
            if (!secure_url || !public_id) {
                return next(new ResError('Cannot Upload Image, Please Try Again', 503))
            }
            product.mainImg = {secure_url, public_id}
        }
        if (files.subImgs) {
            let subImgsList: Image[] = []
            for (let img of files.subImgs) {
                const {secure_url, public_id} = await cloudinary.uploader.upload(
                    img.path, 
                    {folder: `${process.env.APP_NAME}/product/${product.customId}/subImgs`}
                )
                subImgsList.push({secure_url, public_id})
            }
            product.subImgs = subImgsList
        }
    }

    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description
    if (req.body.stock) product.stock = req.body.stock
    if (req.body.price) product.price = req.body.price
    if (req.body.discount) product.discount = req.body.discount
    if (req.body.color) product.color = req.body.color
    if (req.body.size) product.size = req.body.size

    product.updatedBy = req.user._id
    
    if (!await product.save()) {
        return next(new ResError('Something Went Wrong Please Try Again', 500))
    }
    return res.status(200).json({message: 'Done'})
}