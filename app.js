import express from 'express'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
const app = express()

app.use(express.json())

app.use("/api/products", productRoutes)
app.use('/api/orders', orderRoutes)

export default app