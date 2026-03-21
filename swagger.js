import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Selux E-commerce API",
            version: '1.0.0',
            description: "A comprehensive e-commerce platform with role-based access control for sellers, buyers, and administrators"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }, {
                url: "https://selux_app.vercel.app",
                description: "Production server"
            }
        ],
        tags: [
            {
                name: "Authentication & Authorization",
                description: "User authentication, registration, and email confirmation endpoints"
            },
            {
                name: "Products",
                description: "Product management endpoints for sellers and buyers"
            },
            {
                name: "Orders",
                description: "Order management and tracking endpoints"
            },
            {
                name: "Administration",
                description: "Administrative endpoints for system management (admin only)"
            }
        ]
    },
    apis: ['./routes/*.js'],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    }
}


const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec