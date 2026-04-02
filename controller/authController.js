import config from '../config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/emailService.js'
import * as userService from '../services/userService.js'
import * as revokedTokenService from '../services/revokedTokenService.js'
import User from '../models/User.js'

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
            'Welcome to Selux — Confirm your email',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
                <h1 style="color: #4F46E5;">Welcome to Selux 👋</h1>
                <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>, we're excited to have you on board!</p>
                <p style="font-size: 15px; color: #555;">Please confirm your email address to activate your account.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${confirmationLink}"
                    style="background-color: #4F46E5; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
                    Confirm My Email
                    </a>
                </div>
                <p style="font-size: 13px; color: #999;">This link expires in <strong>1 hour</strong>. If you didn't sign up, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="font-size: 12px; color: #bbb; text-align: center;">© ${new Date().getFullYear()} Selux. All rights reserved.</p>
            </div>
    `
        )

        return res.status(200).json({
            success: true,
            message: `Hi ${name}! 🎉 We've sent a configuration link to ${email}. Please check your inbox to activate your account.`,
            next: 'Check your email and click the confirmation link to complete registration.'
        })
    } catch (error) {

        const message =
            console.error(error)
        return res.status(500).json({
            success: false, message
        })
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

        if (!user) {
            return res.status(500).json({ success: false, message: 'Failed to create User' })
        }
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        return res.status(201).json({
            success: true,
            message: `Welcome to Selux, ${user.name}! Your account is now active.`,
            next: 'You can now log in to your account.',
            login_url: `${config.base_url}/api/auth/login`,
            token: jwtToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
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

export const forgotPassword = async (req, res) => {
    try {
        const email = req.body()
        if (!email) { res.status(401).json({ success: false, message: "No Email provided" }) }

        const user = await User.findOne({ email })
        if (!user) { return res.status(404).json({ success: false, message: "User not found" }) }

        const resetToken = await crypto.randomBytes(32).toString('hex')

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        user.passwordResetToken = hashedToken
        user.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000 //15 Mins

        await user.save()

        const resetUrl = `https://localhost:3000/api/auth/reset-password/${resetToken}`

        await sendEmail(
            user.email,
            "Password Reset"
                `<div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding: 32px; background: # #f9f9f9; border-radius: 8px ">
                    <h1 style="color: #4f46e5;">Reset Password</h1>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${confirmationLink}"
                        style="background-color: #4F46E5; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
                        Confirm My Email
                    </a>
                    </div>
                    <p style="font-size: 13px; color: #999;">This link expires in <strong>15 mins</strong>. If you didn't request this Activity , Safely ignore this message</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #bbb; text-align: center;">© ${new Date().getFullYear()} Selux. All rights reserved.</p>
                </div>
                `
        )

        res.status(200).json({ success: true, message: "To reset your password please Check you Email" })

    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
        console.error(err)
    }
}
