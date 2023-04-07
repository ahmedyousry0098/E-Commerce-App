import cloudinary from 'cloudinary'
import {config} from 'dotenv'
config({path: './config/.env'})

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
})

export default cloudinary.v2