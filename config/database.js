import config from '../config.js'
import mongoose from 'mongoose'


const dbConnect = async () => {
    try {
        await mongoose.connect(config.mongodb_uri)
        console.log("Database Connected Sucessfully")
    } catch (error) {
        console.log("Failed to connect to database")
        process.exit()
    }
}

export default dbConnect