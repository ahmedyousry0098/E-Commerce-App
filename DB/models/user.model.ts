import mongoose, {Schema, Document} from 'mongoose'
import {hash, compareHash} from '../../src/utils/encryption'

export interface User {
    userName: string,
    email: string,
    password: string,
    gender: string,
    phone: string,
    DOB?: Date,
    status?: string,
    isConfirmed?: boolean,
    comparePassword: (password:string) => boolean
}

const userSchema = new Schema<User>({
    userName: {
        type: String,
        lowercase: true,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female']
    },
    phone: {
        type: String,
        required: [true, 'Phone Number is required'],
        match: [/^(\+2|002)?01[0125][0-9]{8}$/, 'In-Valid Phone Number']
    },
    DOB: Date,
    status: {
        type: String,
        enum: ['active', 'blocked', 'deleted'],
        default: 'active'
    },
    isConfirmed: {type: Boolean, default: false},
}, {
    timestamps: true,
    methods: {
        comparePassword(password: string): boolean {
            return compareHash(password, this.password)
        }
    }
})

userSchema.pre('save', function(next){
    const hashedPassword = hash(this.password)
    this.password = hashedPassword
    next()
})

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel