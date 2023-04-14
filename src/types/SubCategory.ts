import mongoose from "mongoose"
import { Image } from "./general";

export interface SubCategory {
    _id: typeof mongoose.Types.ObjectId
    customId: string;
    title: string;
    image: Image;
    category: typeof mongoose.Types.ObjectId;
    createdBy: typeof mongoose.Types.ObjectId;
}