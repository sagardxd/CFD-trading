
import { Resend } from 'resend';
import { config, logger } from '@repo/config';

const resend = new Resend(config.RESEND_KEY);

export const sendEmail = async (to: string, token: string) => {
    try {

        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: to,
            subject: 'Your OTP to login',
            html: `<center>
            <h1>Magic Link</h1>
            <a target="_blank" href="${config.FRONTEND_URL}/api/v1/signin/post?token=${token}">Click here</button>
        </center>`
        });

    } catch (error) {
        logger.error('sendEmail', 'error sending email', error)
    }
}