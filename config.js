import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT || 3000,
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire: process.env.JWT_EXPIRE,
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    selux_email: process.env.SELUX_EMAIL,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    ngrok_url: process.env.NGROK_URL,
    supabase_url: process.env.SUPABASE_URL,
    supabase_anon_key: process.env.SUPABASE_KEY,
    supabase_service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY
}