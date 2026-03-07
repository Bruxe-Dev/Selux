import User from '../models/User'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { use } from 'react'

export const register = async (req, res) => {
    const { name, email, password } = req.body

    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    res.status(201).json({
        message: "User createsd sucessfuly",
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
}