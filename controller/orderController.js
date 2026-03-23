import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { calculateDistance, estimateTimeRemaining } from '../services/trackingServices.js'

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

        if (req.user.role === 'client') {
            // Buyers see only their orders
            orders = await Order.find({ client: req.user.id })
                .populate('product', 'name price')
                .sort({ createdAt: -1 })
        } else if (req.user.role === 'seller') {
            // Sellers see orders for their products
            const products = await Product.find({ seller: req.user.id }).select('_id')
            const productIds = products.map(p => p._id)
            orders = await Order.find({ product: { $in: productIds } })
                .populate('product', 'name price')
                .populate('client', 'name email')
                .sort({ createdAt: -1 })
        } else {
            // Admins see all orders
            orders = await Order.find()
                .populate('product', 'name price')
                .populate('client', 'name email')
                .sort({ createdAt: -1 })
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

export const getOrderTracking = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product', 'name price')
            .populate('client', 'name email')

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        // Only client or seller/admin can view via checkOrderOwnership middleware
        // Distance/time fields are updated dynamically
        if (order.deliveryCoordinates?.lat != null && order.deliveryCoordinates?.lng != null && order.currentLocation?.lat != null && order.currentLocation?.lng != null) {
            order.distanceRemaining = calculateDistance(
                order.currentLocation.lat,
                order.currentLocation.lng,
                order.deliveryCoordinates.lat,
                order.deliveryCoordinates.lng
            )

            const remainingMin = estimateTimeRemaining(order.distanceRemaining)
            order.estimatedArrival = new Date(Date.now() + remainingMin * 60 * 1000)
        }

        await order.save()

        return res.status(200).json({
            success: true,
            tracking: {
                orderId: order._id,
                status: order.status,
                deliveryAddress: order.deliveryAddress,
                currentLocation: order.currentLocation,
                distanceRemaining: order.distanceRemaining,
                timeRemainingMinutes: order.distanceRemaining ? estimateTimeRemaining(order.distanceRemaining) : 0,
                estimatedArrival: order.estimatedArrival,
                trackingHistory: order.trackingHistory
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateOrderLocation = async (req, res) => {
    try {
        const { lat, lng, status } = req.body

        if (lat == null || lng == null) {
            return res.status(400).json({ success: false, message: 'lat and lng are required' })
        }

        const order = req.order

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        order.currentLocation = { lat, lng }

        if (order.deliveryCoordinates?.lat != null && order.deliveryCoordinates?.lng != null) {
            order.distanceRemaining = calculateDistance(
                lat,
                lng,
                order.deliveryCoordinates.lat,
                order.deliveryCoordinates.lng
            )

            const remainingMin = estimateTimeRemaining(order.distanceRemaining)
            order.estimatedArrival = new Date(Date.now() + remainingMin * 60 * 1000)
        }

        if (status) {
            order.status = status
        }

        order.trackingHistory = order.trackingHistory || []
        order.trackingHistory.push({
            location: { lat, lng },
            status: status || order.status || 'In transit',
            timestamp: new Date()
        })

        await order.save()

        return res.status(200).json({ success: true, data: order })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getSellerOrders = async (req, res) => {
    try {
        // Get all products by this seller
        const products = await Product.find({ seller: req.user.id }).select('_id')
        const productIds = products.map(p => p._id)

        // Get all orders for these products
        const orders = await Order.find({ product: { $in: productIds } })
            .populate('product', 'name price')
            .populate('client', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered']

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            })
        }

        // Ownership check is handled by middleware
        const order = req.order

        order.status = status
        await order.save()

        res.status(200).json({
            success: true,
            data: order
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// ... existing code ...