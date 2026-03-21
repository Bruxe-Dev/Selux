import Product from '../models/Product.js'
import Order from '../models/Order.js'

export const checkProductOwnership = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ success: false, message: "No Products found" })
        }

        //Check if products really exlist to the seller

        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "NO AUTHORIZATION"
            })
        }

        req.product = product;
        next()
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}