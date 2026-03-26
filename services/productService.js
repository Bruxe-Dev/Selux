import supabase from '../config/database.js';

export const listProducts = async (filters = {}) => {
    let query = supabase.from('products').select(`
    *,
    seller:users(name,email,role)
  `);

    if (filters.seller_id) query = query.eq('seller_id', filters.seller_id);
    if (filters.in_stock !== undefined) query = query.eq('in_stock', filters.in_stock);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*, seller:users(name,email,role)')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const createProduct = async (payload) => {
    const { data, error } = await supabase.from('products').insert(payload).single();
    if (error) throw error;
    return data;
};

export const updateProduct = async (id, payload) => {
    const { data, error } = await supabase
        .from('products')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const deleteProduct = async (id) => {
    const { data, error } = await supabase.from('products').delete().eq('id', id).single();
    if (error) throw error;
    return data;
};