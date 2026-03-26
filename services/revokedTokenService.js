import supabase from '../config/database.js';

export const isTokenRevoked = async (token) => {
    const { data, error } = await supabase
        .from('revoked_tokens')
        .select('token')
        .eq('token', token)
        .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116=No rows found
    return !!data;
};

export const revokeToken = async (token, expiresAt) => {
    const { data, error } = await supabase
        .from('revoked_tokens')
        .insert({ token, expires_at: expiresAt })
        .single();
    if (error) throw error;
    return data;
};
