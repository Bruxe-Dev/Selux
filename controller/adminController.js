import * as userService from '../services/userService.js'
import * as orderServices from '../services/orderServices.js'

export const getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await userService.getAllUsers();
        if (error) throw error;

        res.status(200).json({
            success: true,
            data: {
                buyers: users.filter(user => user.role === 'client'),
                admins: users.filter(user => user.role === 'admin'),
                sellers: users.filter(user => user.role === 'seller')
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderServices.listAllOrders();
        res.status(200).json({ success: true, data: orders })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await userService.deleteUserById(id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const { newRole } = req.body

        const allowedRoles = ['client', 'admin']
        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({ success: false, message: 'Invalid role. Must be client or admin' })
        }

        const updatedUser = await userService.updateUserRole(id, newRole)
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({ success: true, data: updatedUser })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}