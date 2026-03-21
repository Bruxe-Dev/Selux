import * as productService from "../services/productService.js"
import Product from '../models/Product.js'

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
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getProducts = async (req, res) => {
    try {
        let products

        if (req.user.role === 'seller') {
            // Sellers only see their own products
            products = await Product.find({ seller: req.user.id })
        } else {
            // Buyers and admins see all products
            products = await Product.find()
        }

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
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
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            data: product
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        // Ownership check is now handled by middleware
        const product = req.product

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        res.status(200).json({
            success: true,
            data: updatedProduct
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        // Ownership check is now handled by middleware
        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}