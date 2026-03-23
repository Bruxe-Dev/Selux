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
        lng: { type: Number, required: false }
    },
    currentLocation: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false }
    },
    estimatedArrival: {
        type: Date,
        required: false
    },
    distanceRemaining: {
        type: Number, // Distance in kilometers from current location to delivery
        required: false
    },

    trackingHistory: [{
        location: {
            lat: Number,
            lng: Number
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        status: String // e.g., "Picked up", "In transit", "Out for delivery"
    }],

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered"],
        default: "pending"
    }

}, { timestamps: true })

export default mongoose.model("Order", orderSchema)