export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
}

// Mock function to simulate updating order location (in real app, integrate GPS API)
export const updateOrderLocation = async (orderId, newLat, newLng) => {
    // Fetch order from DB
    const order = await Order.findById(orderId)
    if (!order) throw new Error('Order not found')

    // Update current location
    order.currentLocation = { lat: newLat, lng: newLng }

    // Recalculate distance remaining
    if (order.deliveryCoordinates) {
        order.distanceRemaining = calculateDistance(
            newLat, newLng,
            order.deliveryCoordinates.lat, order.deliveryCoordinates.lng
        )
    }

    // Add to tracking history
    order.trackingHistory.push({
        location: { lat: newLat, lng: newLng },
        status: 'In transit' // Or dynamic status
    })

    await order.save()
    return order
}

// Estimate time remaining (assuming average speed of 50 km/h for delivery)
export const estimateTimeRemaining = (distanceKm) => {
    const avgSpeedKmh = 50
    const timeHours = distanceKm / avgSpeedKmh
    return Math.ceil(timeHours * 60)
}