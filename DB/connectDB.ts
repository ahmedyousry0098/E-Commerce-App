import mongoose from 'mongoose'
import "dotenv/config"

const connectDB = async () => {
    await mongoose.connect(`${process.env.DB_URL}`)
        .then(() => {console.log(`DB Connected Successfully`)})
        .catch(err => console.log(err))
}

export default connectDB