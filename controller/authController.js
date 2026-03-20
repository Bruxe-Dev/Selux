import config from '../config.js'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const roles = ['seller', 'client', 'admin']

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (role && !roles.includes(role)) {
            return res.status(400).json({ success: false, message: `Role must be one of ${roles.join(', ')}` })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(15)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'client'
        })

        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        return res.status(201).json({
            success: true,
            message: 'Registered Successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter your credentials'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
