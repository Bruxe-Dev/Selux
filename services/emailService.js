import nodemailer from 'nodemailer'
import config from '../config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email_user,
        pass: config.email_pass
    }
})

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Selux App" < ${config.selux_email}>`,
            to,
            subject,
            html
        })

        console.log("Email Sent Successfully")

    } catch (error) {
        console.log('Failed to sned Email', error)
    }
}