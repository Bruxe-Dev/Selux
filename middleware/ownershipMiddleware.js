import * as productService from '../services/productService.js';
import * as orderService from '../services/orderService.js';

export const checkProductOwnership = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'No product found' });
        }

        if (product.seller_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'NO AUTHORIZATION' });
        }

        req.product = product;
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const checkOrderOwnership = async (req, res, next) => {
    try {
        const order = await orderService.getOrder(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (req.user.role === 'client' && order.client_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'NOT AUTHORIZED' });
        }

        if (req.user.role === 'seller') {
            const product = await productService.getProductById(order.product_id);
            if (!product || product.seller_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'NO AUTHORIZATION' });
            }
        }

        req.order = order;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};