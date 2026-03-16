import Order from '../models/Order.js'
import Product from '../models/Product.js'

export const createOrder = async (req, res) => {

    const { productId, quantity } = req.body;

    if (!productId || quantity) {
        return res.status(400).json({
            success: false,
            message: "No Order specified"
        })
    }

    const product = await Product.findById({ productId })

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product Not In Stock"
        })
    }
}