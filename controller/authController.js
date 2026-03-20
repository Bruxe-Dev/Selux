import config from '../config.js'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const { name, email, password } = req.body

    const existingUser = User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exist" })
    }

    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    res.status(201).json({
        message: "Registered Successfully",
        user
    })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter you credentials"
        })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    const isMatch = bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        config.jwt_secret,
        config.jwt_expire
    )
}