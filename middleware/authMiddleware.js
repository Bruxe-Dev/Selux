import jwt from 'jsonwebtoken'
import config from '../config.js'
import RevokedToken from '../models/RevokedToken.js'

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        // Check blacklist
        const isRevoked = await RevokedToken.findOne({ token })
        if (isRevoked) {
            return res.status(401).json({ message: 'Token has been revoked, please log in again' })
        }

        const decoded = jwt.verify(token, config.jwt_secret)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' })
    }
    next()
}

export const authorizeAdmin = authorizeRoles('admin')
