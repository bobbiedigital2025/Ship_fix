import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || 'demo-key');

// Email sending interface
export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
}

// Batch email interface
export interface BatchEmailData {
  emails: EmailData[];
}

// Default from email
const DEFAULT_FROM = 'no-reply@bobbiedigital.com';

/**
 * Send a single email
 */
export async function sendEmail(emailData: EmailData) {
  try {
    const response = await resend.emails.send({
      from: emailData.from || DEFAULT_FROM,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    console.log('Email sent successfully:', response);
    return {
      success: true,
      data: response,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to send email'
    };
  }
}

/**
 * Send batch emails
 */
export async function sendBatchEmails(batchData: BatchEmailData) {
  try {
    const emailsToSend = batchData.emails.map(email => ({
      from: email.from || DEFAULT_FROM,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }));

    const response = await resend.batch.send(emailsToSend);

    console.log('Batch emails sent successfully:', response);
    return {
      success: true,
      data: response,
      message: 'Batch emails sent successfully'
    };
  } catch (error) {
    console.error('Failed to send batch emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to send batch emails'
    };
  }
}

/**
 * Get email status by ID
 */
export async function getEmailStatus(emailId: string) {
  try {
    const response = await resend.emails.get(emailId);

    return {
      success: true,
      data: response,
      message: 'Email status retrieved successfully'
    };
  } catch (error) {
    console.error('Failed to get email status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to get email status'
    };
  }
}

/**
 * Update scheduled email
 */
export async function updateScheduledEmail(emailId: string, scheduledAt: string) {
  try {
    const response = await resend.emails.update({
      id: emailId,
      scheduledAt: scheduledAt,
    });

    return {
      success: true,
      data: response,
      message: 'Email updated successfully'
    };
  } catch (error) {
    console.error('Failed to update email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update email'
    };
  }
}

/**
 * Cancel scheduled email
 */
export async function cancelEmail(emailId: string) {
  try {
    const response = await resend.emails.cancel(emailId);

    return {
      success: true,
      data: response,
      message: 'Email cancelled successfully'
    };
  } catch (error) {
    console.error('Failed to cancel email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to cancel email'
    };
  }
}

// Email templates
export const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (name: string, companyName: string) => ({
    subject: `Welcome to ${companyName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to ${companyName}!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining us! We're excited to have you on board.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The ${companyName} Team</p>
      </div>
    `,
    text: `Welcome to ${companyName}!\n\nHi ${name},\n\nThank you for joining us! We're excited to have you on board.\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe ${companyName} Team`
  }),

  /**
   * Support ticket confirmation template
   */
  supportTicket: (ticketId: string, customerName: string, subject: string) => ({
    subject: `Support Ticket Created - #${ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Support Ticket Confirmation</h1>
        <p>Hi ${customerName},</p>
        <p>We've received your support request and created ticket <strong>#${ticketId}</strong>.</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Ticket ID:</strong> #${ticketId}</p>
        </div>
        <p>Our support team will review your request and get back to you shortly.</p>
        <p>Best regards,<br>Support Team</p>
      </div>
    `,
    text: `Support Ticket Confirmation\n\nHi ${customerName},\n\nWe've received your support request and created ticket #${ticketId}.\n\nSubject: ${subject}\nTicket ID: #${ticketId}\n\nOur support team will review your request and get back to you shortly.\n\nBest regards,\nSupport Team`
  }),

  /**
   * Generic notification template
   */
  notification: (title: string, message: string, actionUrl?: string) => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${title}</h1>
        <p>${message}</p>
        ${actionUrl ? `<div style="text-align: center; margin: 30px 0;"><a href="${actionUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Take Action</a></div>` : ''}
        <p>Best regards,<br>Your Team</p>
      </div>
    `,
    text: `${title}\n\n${message}\n\n${actionUrl ? `Take action: ${actionUrl}\n\n` : ''}Best regards,\nYour Team`
  })
};
