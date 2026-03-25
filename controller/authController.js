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
            const isBrowser = req.headers.accept && req.headers.accept.includes('text/html')
            if (isBrowser) {
                return res.status(400).send(`
                    <html>
                    <head><title>Email Confirmation Error</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #e74c3c;">Confirmation Error</h1>
                        <p>Token is required. Please check your email for the correct confirmation link.</p>
                        <a href="/" style="color: #3498db;">Go to Homepage</a>
                    </body>
                    </html>
                `)
            }
            return res.status(400).json({ success: false, message: 'Token is required' })
        }

        const decoded = jwt.verify(token, config.jwt_secret)

        const { name, email, password, role, phone } = decoded

        // Check again if user exists
        const existingUser = role === 'seller' ? await Seller.findOne({ email }) : await User.findOne({ email })

        if (existingUser) {
            const isBrowser = req.headers.accept && req.headers.accept.includes('text/html')
            if (isBrowser) {
                return res.status(400).send(`
                    <html>
                    <head><title>Email Already Confirmed</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #f39c12;">Email Already Confirmed</h1>
                        <p>This email has already been confirmed. You can now log in to your account.</p>
                        <a href="/" style="color: #3498db;">Go to Login</a>
                    </body>
                    </html>
                `)
            }
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
                role,
                phone
            })
        }

        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            config.jwt_secret,
            { expiresIn: config.jwt_expire || '1d' }
        )

        const isBrowser = req.headers.accept && req.headers.accept.includes('text/html')
        if (isBrowser) {
            return res.status(201).send(`
                <html>
                <head><title>Email Confirmed Successfully</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #27ae60;">Email Confirmed Successfully!</h1>
                    <p>Welcome ${name}! Your email has been confirmed and your account is now active.</p>
                    <p>You can now log in to your account.</p>
                    <a href="/" style="color: #3498db;">Go to Login</a>
                </body>
                </html>
            `)
        }

        res.status(201).json({
            success: true,
            message: 'Email confirmed and user registered successfully',
            token: jwtToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })

    } catch (error) {
        const isBrowser = req.headers.accept && req.headers.accept.includes('text/html')

        if (error.name === 'TokenExpiredError') {
            if (isBrowser) {
                return res.status(400).send(`
                    <html>
                    <head><title>Confirmation Link Expired</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #e74c3c;">Confirmation Link Expired</h1>
                        <p>This confirmation link has expired. Please register again to receive a new confirmation email.</p>
                        <a href="/" style="color: #3498db;">Register Again</a>
                    </body>
                    </html>
                `)
            }
            return res.status(400).json({ success: false, message: 'Confirmation link has expired' })
        }

        if (error.name === 'JsonWebTokenError') {
            if (isBrowser) {
                return res.status(400).send(`
                    <html>
                    <head><title>Invalid Confirmation Token</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #e74c3c;">Invalid Confirmation Token</h1>
                        <p>The confirmation link is not valid. Please request a new confirmation email.</p>
                        <a href="/" style="color: #3498db;">Try Again</a>
                    </body>
                    </html>
                `)
            }
            return res.status(400).json({ success: false, message: 'Invalid confirmation token' })
        }

        console.log(error)

        if (isBrowser) {
            return res.status(500).send(`
                <html>
                <head><title>Server Error</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #e74c3c;">Server Error</h1>
                    <p>Something went wrong. Please try again later.</p>
                    <a href="/" style="color: #3498db;">Go to Homepage</a>
                </body>
                </html>
            `)
        }

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

        let user = await User.findOne({ email })

        if (!user) {
            user = await Seller.findOne({ email })
        }

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

export const logout = (req, res) => {
    // JWT stateless: logout is client-side token discard. Here we return a standard response.
    return res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove the token on the client side.'
    })
}
