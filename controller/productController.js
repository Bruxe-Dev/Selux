import * as productService from '../services/productService.js';
import { uploadProductImage } from '../services/uploadService.js';

export const getProducts = async (req, res) => {
    try {
        const products = await productService.listProducts(req.query);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProductByName = async (req, res) => {
    try {
        const products = await productService.getProductByName(req.params.name);
        if (!products || products.length === 0) return res.status(404).json({ success: false, message: 'No products found' });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and price are required' })
        }

        let image_url = null
        if (req.file) {
            image_url = await uploadProductImage(req.file.buffer, req.file.mimetype)
        }

        const payload = {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            image_url,
            seller_id: req.user.id
        }

        const product = await productService.createProduct(payload)

        return res.status(201).json({
            success: true,
            message: `Product "${name}" created successfully!`,
            product
        })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};