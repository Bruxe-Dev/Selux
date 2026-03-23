import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: false,
    },

    deliveryCoordinates: {
        lat: { type: Number, required: false },
        long: { type: Number, required: false }
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered"],
        default: "pending"
    }

}, { timestamps: true })

export default mongoose.model("Order", orderSchema)