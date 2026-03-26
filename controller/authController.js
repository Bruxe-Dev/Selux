import config from '../config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/emailService.js'
import * as userService from '../services/userService.js'
import * as revokedTokenService from '../services/revokedTokenService.js'

const roles = ['seller', 'client', 'admin']

export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'client', phone } = req.body

        if (!roles.includes(role)) {
            return res.status(400).json({ success: false, message: `Role must be one of ${roles.join(', ')}` })
        }

        const existingUser = await userService.getUserByEmail(email).catch(() => null)
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const confirmationToken = jwt.sign(
            { name, email, password: hashedPassword, role, phone },
            config.jwt_secret,
            { expiresIn: '1h' }
        )

        const confirmationLink = `${config.base_url}/api/auth/confirm-email?token=${confirmationToken}`

        await sendEmail(
            email,
            'Confirm your email for Selux',
            `
                <h2>Hello ${name}!</h2>
                <p>Please confirm your email to complete your registration.</p>
                <p>Click the link below to confirm:</p>
                <a href="${confirmationLink}">Confirm Email</a>
                <p>This link will expire in 1 hour.</p>
            `
        )

        return res.status(200).json({ success: true, message: 'Registration initiated. Please check your email to confirm.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
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

        const existingUser = await userService.getUserByEmail(email).catch(() => null)
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const user = await userService.createUser({ name, email, password, role, phone }, { skipHash: true })

        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        return res.status(201).json({
            success: true,
            message: 'Email confirmed and user registered successfully',
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'Confirmation link has expired' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ success: false, message: 'Invalid confirmation token' })
        }
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter your credentials' })
        }

        const user = await userService.getUserByEmail(email).catch(() => null)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const isMatch = await userService.verifyPassword(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const logout = async (req, res) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(token, config.jwt_secret)

        const isRevoked = await revokedTokenService.isTokenRevoked(token)
        if (isRevoked) {
            return res.status(200).json({ success: true, message: 'Already logged out' })
        }

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await revokedTokenService.revokeToken(token, expiresAt)

        return res.status(200).json({ success: true, message: 'Logout successful - token has been revoked' })
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}
