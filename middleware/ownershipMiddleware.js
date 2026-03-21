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


export const checkOrderOwnership = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('buyer')

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        // Buyers can only access their own orders
        if (req.user.role === 'client' && order.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'NOT AUTHORIZED'
            })
        }

        // Sellers can only access orders for their products
        if (req.user.role === 'seller') {
            const product = await Product.findById(order.product)
            if (product.seller.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'NO AUTHORIZATION'
                })
            }
        }

        req.order = order
        next()
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}