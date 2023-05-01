import nodemailer from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer';

export type EmailOptions = {
    to: string;
    subject: string;
    html: string;
    attachment?: Attachment[];
}

export const sendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS
        }
    })

    const Info = await transporter.sendMail({
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachment
    })

    return Info
}