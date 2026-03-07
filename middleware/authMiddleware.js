import jwt from 'jsonwebtoken'

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
}