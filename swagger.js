import { version } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Selux Documentation",
            version: '1.0.0',
            description: "This is a simple Seller system that will allow sellers to monitor thie products"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "This is a development server"
            }, {
                url: "https://selux_app.vercel.app",
                description: "This is a deployment server"
            }
        ],
        apis: ['./routes/*.js']
    }
}