import mongoose from "mongoose"

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["seller", "client", "admin"],
        default: "seller"
    },
    phone: {
        type: String,
        required: false
    }
})

export default mongoose.model("Seller", sellerSchema)