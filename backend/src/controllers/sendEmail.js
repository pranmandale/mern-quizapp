
import nodeMailer from "nodemailer";

// Utility function to send email
const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST, 
            service: process.env.SMTP_SERVICE, 
            port: Number(process.env.SMTP_PORT), 
            secure: false, 
            requireTLS: true, 
            auth: {
                user: process.env.SMTP_MAIL, 
                pass: process.env.SMTP_PASSWORD, 
            },
        });

        const options = {
            from: `"Quiz App" <${process.env.SMTP_MAIL}>`, 
            to,
            subject,
            html,
            replyTo: process.env.SMTP_MAIL, 
        };

        await transporter.sendMail(options);
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        throw new Error("Email not sent");
    }
};

export { sendEmail };
