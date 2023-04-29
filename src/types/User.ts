import mongoose from "mongoose";

export interface User {
    _id: typeof mongoose.Types.ObjectId;
    userName: string,
    email: string,
    password: string,
    gender: string,
    phone: string,
    DOB?: Date,
    status?: string,
    isConfirmed?: boolean,
    resetCode?: string,
    lastChangePasswordTime: Date,
    wishList: typeof mongoose.Types.ObjectId []
    comparePassword: (password:string) => boolean
}
