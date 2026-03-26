import * as productService from '../services/productService.js';

export const getProducts = async (req, res) => {
    try {
        const products = await productService.listProducts(req.query);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const payload = { ...req.body, seller_id: req.user.id };
        const product = await productService.createProduct(payload);
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};