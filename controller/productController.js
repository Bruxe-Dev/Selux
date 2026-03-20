import * as productService from "../services/productService.js"

export const createProduct = async (req, res) => {
    try {
        if (!req.user || !['seller', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Only seller/admin can create products' })
        }

        const productData = {
            ...req.body,
            seller: req.user.id
        }

        const product = await productService.createProducts(productData)

        res.status(201).json({
            success: true,
            data: product
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
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

export const getProductByName = async (req, res) => {
    try {
        const { name } = req.params

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'No product name given'
            })
        }

        const productData = await productService.getProductByName(name)

        res.status(200).json({
            success: true,
            data: productData
        })
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message })
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
        const product = await productService.getProductById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to update this product' })
        }

        const updated = await productService.updateProduct(req.params.id, req.body)
        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to delete this product' })
        }

        await productService.deleteProduct(req.params.id)

        res.json({ message: 'Product deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}