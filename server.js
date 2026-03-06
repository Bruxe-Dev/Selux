import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import app from './app.js'
import dbConnect from './config/database.js'
import swaggeruiexpress from 'swagger-ui-express'
import swaggerSpec from './swagger.js'

dbConnect()

app.use('/api/docs', swaggeruiexpress.serve, swaggeruiexpress.setup(swaggerSpec))

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to selux"
    })
})
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})