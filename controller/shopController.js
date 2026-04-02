import * as userService from '../services/userService.js'
import * as productService from '../services/productService.js'

const validStates = ['OPEN', 'CLOSED']

export const getShops = async (req, res) => {
    try {
        const { status, search } = req.query

        if (status && !validStates.includes(status.toUpperCase())) {
            return res.status(400).json({ success: false, message: 'status must be OPEN or CLOSED' })
        }

        const sellers = await userService.getSellers({
            status: status ? status.toUpperCase() : undefined,
            search
        })

        return res.status(200).json({ success: true, count: sellers.length, data: sellers })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getShop = async (req, res) => {
    try {
        const seller = await userService.getSellerById(req.params.id)

        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ success: false, message: 'Shop not found' })
        }

        return res.status(200).json({ success: true, data: seller })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateShopStatus = async (req, res) => {
    try {
        const { status } = req.body
        const { id } = req.params

        if (!status || !validStates.includes(status.toUpperCase())) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be OPEN or CLOSED' })
        }

        if (req.user.role === 'seller' && req.user.id !== id) {
            return res.status(403).json({ success: false, message: 'Not authorized to change this seller status' })
        }

        const updatedSeller = await userService.updateSellerStatus(id, status.toUpperCase())

        if (!updatedSeller) {
            return res.status(404).json({ success: false, message: 'Seller not found' })
        }

        return res.status(200).json({ success: true, message: `Shop status set to ${status.toUpperCase()}`, data: updatedSeller })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getShopProducts = async (req, res) => {
    try {
        const seller = await userService.getSellerById(req.params.id)
        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ success: false, message: 'Shop not found' })
        }

        const products = await productService.listProducts({ seller_id: req.params.id })
        return res.status(200).json({ success: true, count: products.length, data: products })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}
