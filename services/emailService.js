import nodemailer from 'nodemailer'
import config from '../config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email_user,
        pass: config.email_pass
    }
})