import mongoose from "mongoose";

export interface User {
    _id: mongoose.Types.ObjectId;
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
    comparePassword: (password:string) => boolean
}
