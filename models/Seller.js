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
    },
    shopName: String,
    shopStatus: {
        type: String,
        enum: ["OPEN", "CLOSED"],
        default: "CLOSED"
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number] // [longitude, latitude]
        }
    }
})

export default mongoose.model("Seller", sellerSchema)