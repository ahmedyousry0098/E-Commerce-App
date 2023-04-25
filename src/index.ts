import express, {NextFunction, Request, Response} from 'express'
import { User } from './types/User'
import connectDB from '../DB/connectDB'
import authRouter from './modules/auth/auth.routes'
import categoryRouter from './modules/category/catrgory.routes'
import couponRouter from './modules/coupon/coupon.routes'
import cartRouter from './modules/cart/cart.routes'
import orderRouter from './modules/order/order.routes'
import { globalErrorHandling } from './utils/errorHandling'
import productRouter from './modules/product/product.routes'
import { config } from "dotenv"
config({path: './config/.env'})

declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}

connectDB()

const app = express()
const port = process.env.PORT
const baseURL = process.env.BASE_URL

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(`${baseURL}`, authRouter)
app.use(`${baseURL}/category`, categoryRouter)
app.use(`${baseURL}/coupon`, couponRouter)
app.use(`${baseURL}/product`, productRouter)
app.use(`${baseURL}/cart`, cartRouter)
app.use(`${baseURL}/order`, orderRouter)

app.use('*', (_, res: Response) => {
    return res.status(404).json({message: 'Page Not Found'})
})

app.use(globalErrorHandling)

app.listen(port, () => {
    console.log(`App is Running On Port ${port}`);
})