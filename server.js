import config from './config.js'
import app from './app.js'
import swaggeruiexpress from 'swagger-ui-express'
import swaggerSpec from './swagger.js'

app.use('/api/docs', swaggeruiexpress.serve, swaggeruiexpress.setup(swaggerSpec))

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to selux"
    })
})
app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})