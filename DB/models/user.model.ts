import mongoose, {Schema} from 'mongoose'
import {hash, compareHash} from '../../src/utils/encryption'
import { User } from '../../src/types/User'

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
    status: {
        type: String,
        enum: ['active', 'blocked', 'deleted'],
        default: 'active'
    },
    DOB: Date,
    isConfirmed: {type: Boolean, default: false},
    resetCode: String,
    lastChangePasswordTime: Date,
    wishList: {
        type: [{type: mongoose.Types.ObjectId, ref: 'Product'}]
    }
}, {
    timestamps: true,
    methods: {
        comparePassword(password: string): boolean {
            return compareHash(password, this.password)
        }
    }
})

userSchema.pre('save', function(next){
    if (this.isModified('password')) {
        const hashedPassword = hash(this.password)
        this.password = hashedPassword
        this.lastChangePasswordTime = new Date()
        next()
    }
})

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel