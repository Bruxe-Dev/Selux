import supabase from '../config/database.js';

export const getOrder = async (id) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

export const listOrdersForClient = async (clientId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const listOrdersForSeller = async (sellerId) => {
    const { data, error } = await supabase.rpc('orders_by_seller', { seller_id: sellerId });
    if (error) throw error;
    return data;
};

export const createOrder = async (payload) => {
    const { data, error } = await supabase.from('orders').insert(payload).single();
    if (error) throw error;
    return data;
};

export const updateOrder = async (id, payload) => {
    const { data, error } = await supabase
        .from('orders')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};