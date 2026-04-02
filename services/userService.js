import bcrypt from 'bcryptjs';
import supabase from '../config/database.js';

export const createUser = async ({ name, email, password, role = 'client', phone }, options = { skipHash: false }) => {
    const finalPassword = options.skipHash ? password : await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('users').insert({
        name,
        email,
        password: finalPassword,
        role,
        phone
    }).select().single();

    if (error) throw error;
    return data;
};

export const getUserByEmail = async (email) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) throw error;
    return data;
};

export const getAllUsers = async () => {
    const { data, error } = await supabase.from('users').select('id,name,email,role,phone');
    if (error) throw error;
    return data;
};

export const deleteUserById = async (id) => {
    const { data, error } = await supabase.from('users').delete().eq('id', id).single();
    if (error) throw error;
    return data;
};

export const updateUserRole = async (id, newRole) => {
    const { data, error } = await supabase.from('users').update({ role: newRole }).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const getSellers = async ({ status, search } = {}) => {
    let query = supabase.from('users').select('id,name,email,role,phone,shop_name,shop_status,location').eq('role', 'seller')

    if (status) {
        query = query.eq('shop_status', status)
    }

    if (search) {
        query = query.ilike('shop_name', `%${search}%`)
    }

    const { data, error } = await query.order('name', { ascending: true })
    if (error) throw error
    return data
}

export const getSellerById = async (id) => {
    const { data, error } = await supabase.from('users').select('id,name,email,role,phone,shop_name,shop_status,location').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const updateSellerStatus = async (id, status) => {
    const { data, error } = await supabase.from('users').update({ shop_status: status }).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const verifyPassword = async (plain, hash) => bcrypt.compare(plain, hash);