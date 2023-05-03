import mongoose from "mongoose"
import { Image } from "./general.types";

export interface ICategory {
    _id: typeof mongoose.Types.ObjectId;
    customId: string;
    title: string;
    slug: string;
    createdBy: typeof mongoose.Types.ObjectId;
    updatedBy: typeof mongoose.Types.ObjectId;
    image: Image
}