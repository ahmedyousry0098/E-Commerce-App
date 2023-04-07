import express, {NextFunction, Request, Response} from 'express'
import connectDB from '../DB/connectDB'
import categoryRouter from './modules/category/catrgory.routes'
import { config } from 'dotenv'
import { globalErrorHandling } from './utils/errorHandling'
import { log } from 'console'

config({path: './config/.env'})

connectDB()

const app = express()
const port = process.env.PORT
const baseURL = process.env.BASE_URL

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(`${baseURL}/category`, categoryRouter)

app.use('*', (_, res: Response) => {
    return res.status(404).json({message: 'Page Not Found'})
})

app.use(globalErrorHandling)

app.listen(port, () => {
    console.log(`App is Running On Port ${port}`);
})
