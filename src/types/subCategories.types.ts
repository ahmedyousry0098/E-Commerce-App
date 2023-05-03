import mongoose from "mongoose"
import { Image } from "./general.types";

export interface ISubCategory {
    _id: typeof mongoose.Types.ObjectId
    customId: string;
    title: string;
    image: Image;
    category: typeof mongoose.Types.ObjectId;
    createdBy: typeof mongoose.Types.ObjectId;
    updatedBy?: typeof mongoose.Types.ObjectId;
}