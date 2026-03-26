import mongoose from "mongoose";
import supabase from '../config/supabase.js'
import config from '../config.js'
import Product from "../models/Product.js";
import Order from '../models/Order.js';
import User from '../models/User.js';

(async () => {
    await mongoose.connect(config.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const users = await User.find().lean();
    const products = await Product.find().lean();
    const orders = await Order.find().lean();

    const supaUsers = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        phone: u.phone?.toString(),
        created_at: u.createdAt || new Date(),
        updated_at: u.updatedAt || new Date()
    }));

    const { error: userErr } = await supabase.from('users').insert(supaUsers, { upsert: true });
    if (userErr) throw userErr;

    const supaProducts = products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        quantity: p.quantity,
        discount: p.discount,
        seller_id: p.seller.toString(),
        in_stock: p.inStock,
        added_at: p.addedAt || new Date(),
        sold_at: p.soldAt || null,
        created_at: p.createdAt || new Date(),
        updated_at: p.updatedAt || new Date()
    }));

    const { error: prodErr } = await supabase.from('products').insert(supaProducts, { upsert: true });
    if (prodErr) throw prodErr;

    const supaOrders = orders.map(o => ({
        id: o._id.toString(),
        product_id: o.product.toString(),
        client_id: o.client.toString(),
        quantity: o.quantity,
        total_price: o.totalPrice,
        delivery_address: o.deliveryAddress,
        delivery_lat: o.deliveryCoordinates?.lat,
        delivery_lng: o.deliveryCoordinates?.lng,
        current_lat: o.currentLocation?.lat,
        current_lng: o.currentLocation?.lng,
        estimated_arrival: o.estimatedArrival,
        distance_remaining: o.distanceRemaining,
        status: o.status,
        tracking_history: o.trackingHistory || [],
        created_at: o.createdAt || new Date(),
        updated_at: o.updatedAt || new Date()
    }));

    const { error: orderErr } = await supabase.from('orders').insert(supaOrders, { upsert: true });
    if (orderErr) throw orderErr;

    console.log('Migration complete');
    process.exit(0);
})();