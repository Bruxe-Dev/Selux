import supabase from '../config/supabase.js';

export const createOrder = async (payload) => {
    const { data, error } = await supabase.from('orders').insert(payload).single();
    if (error) throw error;
    return data;
};

export const getOrder = async (id) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      product:products(name,price,quantity,seller_id),
      client:users(name,email,role)
    `)
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const listOrdersByClient = async (clientId) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      product:products(name,price),
      client:users(name,email)
    `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const updateOrderStatus = async (id, status, trackingUpdate) => {
    const payload = { status, updated_at: new Date().toISOString() };
    if (trackingUpdate) payload.tracking_history = supabase.raw(`
    jsonb_insert(coalesce(tracking_history, '[]'), '{999999}', to_jsonb(${JSON.stringify(trackingUpdate)}), true)
  `);

    const { data, error } = await supabase.from('orders').update(payload).eq('id', id).single();
    if (error) throw error;
    return data;
};