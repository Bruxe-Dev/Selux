import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';

export const createUser = async ({ name, email, password, role = 'client', phone }) => {
    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').insert({
        name, email, password: hashed, role, phone
    }).single();
    if (error) throw error;
    return data;
};

export const getUserByEmail = async (email) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) throw error;
    return data;
};

export const verifyPassword = async (plain, hash) => bcrypt.compare(plain, hash);