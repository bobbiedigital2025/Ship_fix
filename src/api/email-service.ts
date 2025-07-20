import { 
  sendEmail, 
  sendBatchEmails, 
  getEmailStatus, 
  updateScheduledEmail, 
  cancelEmail,
  emailTemplates,
  type EmailData,
  type BatchEmailData
} from './email';

/**
 * Email Service Class - Higher level wrapper for email operations
 */
export class ResendEmailService {
  private static readonly DEFAULT_FROM = 'no-reply@bobbiedigital.com';
  private static readonly SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@bobbiedigital.com';
  private static readonly COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || 'Your Company';

  /**
   * Send a welcome email to a new user
   */
  static async sendWelcomeEmail(userEmail: string, userName: string) {
    const template = emailTemplates.welcome(userName, this.COMPANY_NAME);
    
    return await sendEmail({
      to: userEmail,
      from: this.DEFAULT_FROM,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Send support ticket confirmation
   */
  static async sendSupportTicketConfirmation(
    customerEmail: string, 
    customerName: string, 
    ticketId: string, 
    subject: string
  ) {
    const template = emailTemplates.supportTicket(ticketId, customerName, subject);
    
    return await sendEmail({
      to: customerEmail,
      from: this.DEFAULT_FROM,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Send notification to support team
   */
  static async notifySupportTeam(subject: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const priorityEmoji = {
      low: '🟢',
      medium: '🟡', 
      high: '🔴'
    };

    return await sendEmail({
      to: this.SUPPORT_EMAIL,
      from: this.DEFAULT_FROM,
      subject: `${priorityEmoji[priority]} ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Support Team Notification</h1>
          <div style="background: ${priority === 'high' ? '#fef2f2' : priority === 'medium' ? '#fefce8' : '#f0fdf4'}; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Priority:</strong> ${priority.toUpperCase()} ${priorityEmoji[priority]}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p>${message}</p>
          </div>
          <p>Please review and take appropriate action.</p>
        </div>
      `,
      text: `Support Team Notification\n\nPriority: ${priority.toUpperCase()}\nSubject: ${subject}\n\nMessage:\n${message}\n\nPlease review and take appropriate action.`
    });
  }

  /**
   * Send custom notification
   */
  static async sendNotification(
    recipient: string, 
    title: string, 
    message: string, 
    actionUrl?: string
  ) {
    const template = emailTemplates.notification(title, message, actionUrl);
    
    return await sendEmail({
      to: recipient,
      from: this.DEFAULT_FROM,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Send bulk notifications
   */
  static async sendBulkNotifications(
    recipients: string[], 
    title: string, 
    message: string
  ) {
    const template = emailTemplates.notification(title, message);
    
    const emails = recipients.map(recipient => ({
      to: recipient,
      from: this.DEFAULT_FROM,
      subject: template.subject,
      html: template.html,
      text: template.text
    }));

    return await sendBatchEmails({ emails });
  }

  /**
   * Send custom email with full control
   */
  static async sendCustomEmail(emailData: EmailData) {
    return await sendEmail({
      ...emailData,
      from: emailData.from || this.DEFAULT_FROM
    });
  }

  /**
   * Send scheduled email (future delivery)
   */
  static async sendScheduledEmail(emailData: EmailData, scheduledDate: Date) {
    // Note: Resend handles scheduling during the send operation
    // For now, we'll send immediately but this could be extended
    console.log(`Email scheduled for: ${scheduledDate.toISOString()}`);
    return await this.sendCustomEmail(emailData);
  }

  /**
   * Get email delivery status
   */
  static async getDeliveryStatus(emailId: string) {
    return await getEmailStatus(emailId);
  }

  /**
   * Update scheduled email
   */
  static async updateScheduledEmail(emailId: string, newScheduledDate: Date) {
    return await updateScheduledEmail(emailId, newScheduledDate.toISOString());
  }

  /**
   * Cancel a scheduled email
   */
  static async cancelScheduledEmail(emailId: string) {
    return await cancelEmail(emailId);
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(
    customerEmail: string, 
    customerName: string, 
    orderId: string, 
    orderDetails: any
  ) {
    return await sendEmail({
      to: customerEmail,
      from: this.DEFAULT_FROM,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Confirmation</h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! We've received your order and are processing it now.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You'll receive a shipping confirmation email once your order is on its way.</p>
          <p>Best regards,<br>The ${this.COMPANY_NAME} Team</p>
        </div>
      `,
      text: `Order Confirmation\n\nHi ${customerName},\n\nThank you for your order! We've received your order and are processing it now.\n\nOrder ID: #${orderId}\nOrder Date: ${new Date().toLocaleDateString()}\n\nYou'll receive a shipping confirmation email once your order is on its way.\n\nBest regards,\nThe ${this.COMPANY_NAME} Team`
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(userEmail: string, resetUrl: string, userName?: string) {
    return await sendEmail({
      to: userEmail,
      from: this.DEFAULT_FROM,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Password Reset Request</h1>
          <p>Hi${userName ? ` ${userName}` : ''},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>Best regards,<br>The ${this.COMPANY_NAME} Team</p>
        </div>
      `,
      text: `Password Reset Request\n\nHi${userName ? ` ${userName}` : ''},\n\nWe received a request to reset your password. Use the link below to reset it:\n\n${resetUrl}\n\nIf you didn't request this password reset, please ignore this email.\n\nThis link will expire in 24 hours for security reasons.\n\nBest regards,\nThe ${this.COMPANY_NAME} Team`
    });
  }
}
