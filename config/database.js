import config from '../config.js'
import { createClient } from '@supabase/supabase-js'

const supabaseKey = config.supabase_service_role_key || config.supabase_anon_key
if (!supabaseKey) {
    throw new Error('Supabase key is missing. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY in .env')
}

const supabase = createClient(
    config.supabase_url,
    supabaseKey
)

export default supabase;