import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmailToAlumni = async ({ to, subject, body }) => {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info?.messageId) {
      throw new Error('Failed to send email: No message ID returned');
    }

    console.log('📧 Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { error: error.message };
  }
};
