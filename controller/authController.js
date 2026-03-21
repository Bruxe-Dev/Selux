import config from '../config.js'
import User from '../models/User.js'
import Seller from '../models/Seller.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/emailService.js'

const roles = ['seller', 'client', 'admin']

export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body

        if (role && !roles.includes(role)) {
            return res.status(400).json({ success: false, message: `Role must be one of ${roles.join(', ')}` })
        }

        const existingUser = role === 'seller' ? await Seller.findOne({ email }) : await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(15)
        const hashedPassword = await bcrypt.hash(password, salt)

        const confirmationToken = jwt.sign(
            { name, email, password: hashedPassword, role: role || 'client', phone },
            config.jwt_secret,
            { expiresIn: '1h' }
        )

        const confirmationLink = `${config.base_url}/api/auth/confirm-email?token=${confirmationToken}`

        await sendEmail(
            email,
            "Confirm your email for Selux",
            `
                <h2>Hello ${name}!</h2>
                <p>Please confirm your email to complete your registration.</p>
                <p>Click the link below to confirm:</p>
                <a href="${confirmationLink}">Confirm Email</a>
                <p>This link will expire in 1 hour.</p>
                `
        )

        res.status(200).json({ success: true, message: 'Registration initiated. Please check your email to confirm.' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' })
        }

        const decoded = jwt.verify(token, config.jwt_secret)

        const { name, email, password, role, phone } = decoded

        // Check again if user exists
        const existingUser = role === 'seller' ? await Seller.findOne({ email }) : await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        let user
        if (role === 'seller') {
            user = await Seller.create({
                name,
                email,
                password,
                role,
                phone
            })
        } else {
            user = await User.create({
                name,
                email,
                password,
                role
            })
        }

        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        res.status(201).json({
            success: true,
            message: 'Email confirmed and user registered successfully',
            token: jwtToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'Confirmation link has expired' })
        }
        console.log(error)
        res.status(500).json({ success: false, message: 'Server error' })
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
