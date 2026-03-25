import User from '../models/User.js'
import Seller from '../models/Seller.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
        const sellers = await Seller.find({}, '-password')

        res.status(200).json({
            success: true,
            data: {
                buyers: users.filter(user => user.role === 'client'),
                admins: users.filter(user => user.role === 'admin'),
                sellers: sellers
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('product', 'name price')
            .populate('seller', 'name email')

        res.status(200).json({
            success: true,
            data: orders
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id, type } = req.params

        let user
        if (type === 'seller') {
            user = await Seller.findByIdAndDelete(id)
        } else {
            user = await User.findByIdAndDelete(id)
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { id, type } = req.params
        const { newRole } = req.body

        const allowedRoles = ['client', 'admin']

        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be client or admin'
            })
        }

        let user
        if (type === 'seller') {
            // If changing from seller to client/admin, move to User collection
            const seller = await Seller.findById(id)
            if (!seller) {
                return res.status(404).json({ success: false, message: 'Seller not found' })
            }

            // Create user in User collection
            user = await User.create({
                name: seller.name,
                email: seller.email,
                password: seller.password,
                role: newRole,
                phone: seller.phone
            })

            // Delete from Seller collection
            await Seller.findByIdAndDelete(id)
        } else {
            user = await User.findByIdAndUpdate(
                id,
                { role: newRole },
                { new: true }
            ).select('-password')
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}