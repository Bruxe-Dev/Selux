import config from '../config.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    config.supabase_url,
    config.supabase_anon_key
)
export default dbConnect