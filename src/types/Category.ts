import mongoose from "mongoose"
import { Image } from "./general";

export interface Category {
    _id: typeof mongoose.Types.ObjectId;
    customId: string;
    title: string;
    slug: string;
    createdBy: typeof mongoose.Types.ObjectId;
    image: Image
}