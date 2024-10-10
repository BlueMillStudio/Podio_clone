// backend/services/emailService.js

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
    EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

async function sendVerificationEmail(to, token) {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_ADDRESS,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

        const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

        const mailOptions = {
            from: `"Podio Clone" <${EMAIL_ADDRESS}>`,
            to,
            subject: 'Email Verification',
            html: `
        <h2>Email Verification</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
        };

        await transport.sendMail(mailOptions);
        console.log('Verification email sent to:', to);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

module.exports = { sendVerificationEmail };
