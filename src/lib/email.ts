import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await resend.emails.send({
      from: 'Reloji <noreply@yourdomain.com>', // Replace with your domain
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    // In a real app, you might want to add more robust error handling or a fallback mechanism
  }
}
