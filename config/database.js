import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected Sucessfully")
    } catch (error) {
        console.log("Failed to connect to database")
        process.exit()
    }
}

export default dbConnect