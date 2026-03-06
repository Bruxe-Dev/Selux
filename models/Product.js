import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: [0, 'Price must not be less than 0'],
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Product Quantity must not be less than 0']
    },
    discount: {
        type: Number,
        default: 0,
        max: [20, 'Discount cannot overceed 20 percent']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    soldAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
export default Product