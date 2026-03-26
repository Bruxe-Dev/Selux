import * as orderServices from '../services/orderServices.js'
import * as productService from '../services/productService.js'
import { calculateDistance, estimateTimeRemaining } from '../services/trackingServices.js'

export const createOrder = async (req, res) => {
    try {
        const { productId, quantity, deliveryAddress, deliveryCoordinates } = req.body

        if (!productId || !quantity) {
            return res.status(400).json({ success: false, message: 'ProductId and quantity are required' })
        }

        if (!req.user || req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Only buyers can place orders' })
        }

        const product = await productService.getProductById(productId)
        if (!product || product.quantity < quantity) {
            return res.status(404).json({ success: false, message: 'Product not found or insufficient quantity' })
        }

        const totalPrice = Number(product.price) * quantity

        const order = await orderServices.createOrder({
            product_id: productId,
            client_id: req.user.id,
            quantity,
            total_price: totalPrice,
            delivery_address: deliveryAddress || '',
            delivery_coordinates: deliveryCoordinates || null,
            current_lat: null,
            current_lng: null,
            estimated_arrival: null,
            distance_remaining: null,
            tracking_history: [],
            status: 'pending'
        })

        await productService.updateProduct(productId, {
            quantity: product.quantity - quantity,
            in_stock: product.quantity - quantity > 0
        })

        return res.status(201).json({ success: true, order })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Internal Server error' })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        let orders

        if (req.user.role === 'client') {
            orders = await orderServices.listOrdersByClient(req.user.id)
        } else if (req.user.role === 'seller') {
            // seller-specific SQL function can resolve this in supabase
            orders = await orderServices.listOrdersForSeller(req.user.id)
        } else {
            orders = await orderServices.listAllOrders()
        }

        return res.status(200).json({ success: true, count: orders.length, data: orders })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getOrderTracking = async (req, res) => {
    try {
        const order = await orderServices.getOrder(req.params.id)
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        if (order.delivery_coordinates?.lat != null && order.delivery_coordinates?.lng != null && order.current_lat != null && order.current_lng != null) {
            const distanceRemaining = calculateDistance(order.current_lat, order.current_lng, order.delivery_coordinates.lat, order.delivery_coordinates.lng)
            const estimatedArrival = new Date(Date.now() + estimateTimeRemaining(distanceRemaining) * 60 * 1000)

            await orderServices.updateOrder(order.id, {
                distance_remaining: distanceRemaining,
                estimated_arrival: estimatedArrival
            })

            order.distance_remaining = distanceRemaining
            order.estimated_arrival = estimatedArrival
        }

        return res.status(200).json({
            success: true,
            tracking: {
                orderId: order.id,
                status: order.status,
                deliveryAddress: order.delivery_address,
                currentLocation: { lat: order.current_lat, lng: order.current_lng },
                distanceRemaining: order.distance_remaining,
                timeRemainingMinutes: order.distance_remaining ? estimateTimeRemaining(order.distance_remaining) : 0,
                estimatedArrival: order.estimated_arrival,
                trackingHistory: order.tracking_history
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateOrderLocation = async (req, res) => {
    try {
        const { lat, lng, status } = req.body
        if (lat == null || lng == null) {
            return res.status(400).json({ success: false, message: 'lat and lng are required' })
        }

        const order = await orderServices.getOrder(req.params.id)
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        const updatedPayload = {
            current_lat: lat,
            current_lng: lng,
            tracking_history: [...(order.tracking_history || []), { location: { lat, lng }, status: status || order.status || 'In transit', timestamp: new Date() }]
        }

        if (order.delivery_coordinates?.lat != null && order.delivery_coordinates?.lng != null) {
            const distanceRemaining = calculateDistance(lat, lng, order.delivery_coordinates.lat, order.delivery_coordinates.lng)
            const estimatedArrival = new Date(Date.now() + estimateTimeRemaining(distanceRemaining) * 60 * 1000)
            updatedPayload.distance_remaining = distanceRemaining
            updatedPayload.estimated_arrival = estimatedArrival
        }

        if (status) {
            updatedPayload.status = status
        }

        const updatedOrder = await orderServices.updateOrder(req.params.id, updatedPayload)
        return res.status(200).json({ success: true, data: updatedOrder })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getSellerOrders = async (req, res) => {
    try {
        const orders = await orderServices.listOrdersForSeller(req.user.id)
        return res.status(200).json({ success: true, count: orders.length, data: orders })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered']

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') })
        }

        const updated = await orderServices.updateOrderStatus(req.params.id, status)
        return res.status(200).json({ success: true, data: updated })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}
