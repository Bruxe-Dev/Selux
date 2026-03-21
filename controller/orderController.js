import Order from '../models/Order.js'
import Product from '../models/Product.js'

export const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'ProductId and quantity are required'
            })
        }

        const product = await Product.findById(productId)

        if (!product || product.quantity < quantity) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or insufficient quantity'
            })
        }

        if (!req.user || req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Only buyers can place orders' })
        }

        const totalPrice = product.price * quantity

        const order = await Order.create({
            product: productId,
            client: req.user.id,
            quantity,
            totalPrice
        })

        // Decrease stock quantity
        product.quantity -= quantity
        if (product.quantity === 0) product.inStock = false
        await product.save()

        res.status(201).json({
            success: true,
            order
        })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal Server error' })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        let orders

        if (req.user.role === 'admin') {
            orders = await Order.find().populate('product', 'name price').sort({ createdAt: -1 })
        } else {
            orders = await Order.find({ client: req.user.id }).populate('product', 'name price').sort({ createdAt: -1 })
        }

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// ... existing code ...

export const getMyOrders = async (req, res) => {
    try {
        let orders

        if (req.user.role === 'client') {
            // Buyers see only their orders
            orders = await Order.find({ buyer: req.user.id })
                .populate('product', 'name price')
                .populate('seller', 'name email')
        } else if (req.user.role === 'seller') {
            // Sellers see orders for their products
            const products = await Product.find({ seller: req.user.id }).select('_id')
            const productIds = products.map(p => p._id)
            orders = await Order.find({ product: { $in: productIds } })
                .populate('product', 'name price')
                .populate('buyer', 'name email')
        } else {
            // Admins see all orders
            orders = await Order.find()
                .populate('product', 'name price')
                .populate('buyer', 'name email')
                .populate('seller', 'name email')
        }

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// ... existing code ...