import nodemailer from 'nodemailer'
import config from '../config.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email_user,
        pass: config.email_pass
    }
})