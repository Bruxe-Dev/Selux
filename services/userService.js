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