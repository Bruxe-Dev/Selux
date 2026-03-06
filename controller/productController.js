import * as productService from "../services/productService.js"

export const createProduct = async (req, res) => {
    try {

        const product = await productService.createProducts(req.body)

        res.status(201).json({
            success: true,
            data: product
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getProducts = async (req, res) => {
    try {

        const products = await productService.getProducts()

        res.json(products)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getProduct = async (req, res) => {
    try {

        const product = await productService.getProductById(req.params.id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        res.json(product)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {

        const product = await productService.updateProduct(
            req.params.id,
            req.body
        )

        res.json(product)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {

        await productService.deleteProduct(req.params.id)

        res.json({
            message: "Product deleted"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}