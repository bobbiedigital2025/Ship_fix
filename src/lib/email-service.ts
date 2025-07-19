import { apiConfig } from '@/lib/env';
import { SupportTicket, SupportResponse } from '@/types/support';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static readonly SUPPORT_EMAIL = 'marketing-support@bobbiedigital.com';
  private static readonly FROM_EMAIL = 'no-reply@bobbiedigital.com';

  static async sendSupportTicketNotification(ticket: SupportTicket): Promise<void> {
    const template = this.generateTicketNotificationTemplate(ticket);
    
    try {
      await this.sendEmail({
        to: this.SUPPORT_EMAIL,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`Support ticket notification sent for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send support ticket notification:', error);
      throw error;
    }
  }

  static async sendCustomerConfirmation(ticket: SupportTicket): Promise<void> {
    const template = this.generateCustomerConfirmationTemplate(ticket);
    
    try {
      await this.sendEmail({
        to: ticket.customerEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`Customer confirmation sent for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send customer confirmation:', error);
      throw error;
    }
  }

  static async sendTicketResponse(ticket: SupportTicket, response: SupportResponse): Promise<void> {
    const template = this.generateTicketResponseTemplate(ticket, response);
    
    try {
      await this.sendEmail({
        to: ticket.customerEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`Ticket response sent for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send ticket response:', error);
      throw error;
    }
  }

  private static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    try {
      const resendApiKey = apiConfig.resend.getApiKey();
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.FROM_EMAIL,
          to: params.to,
          subject: params.subject,
          html: params.html,
          text: params.text,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to send email: ${error.message}`);
      }
    } catch (error) {
      // In development, just log the email instead of actually sending
      if (import.meta.env.DEV) {
        console.log('📧 Email would be sent (DEV MODE):');
        console.log('To:', params.to);
        console.log('Subject:', params.subject);
        console.log('Content:', params.text.substring(0, 200) + '...');
        return; // Don't throw error in development
      }
      throw error;
    }
  }

  private static generateTicketNotificationTemplate(ticket: SupportTicket): EmailTemplate {
    const priorityColor = this.getPriorityColor(ticket.severity);
    
    return {
      subject: `[${ticket.severity.toUpperCase()}] New Support Ticket #${ticket.id}: ${ticket.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Support Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .ticket-info { background-color: #ffffff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .severity { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; color: white; background-color: ${priorityColor}; }
            .label { font-weight: bold; color: #495057; }
            .actions { margin-top: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Support Ticket Received</h1>
            <p>A new support ticket has been submitted and requires attention.</p>
          </div>
          
          <div class="ticket-info">
            <h2>Ticket Details</h2>
            <p><span class="label">Ticket ID:</span> #${ticket.id}</p>
            <p><span class="label">Subject:</span> ${ticket.subject}</p>
            <p><span class="label">Severity:</span> <span class="severity">${ticket.severity.toUpperCase()}</span></p>
            <p><span class="label">Category:</span> ${ticket.category}</p>
            <p><span class="label">Status:</span> ${ticket.status}</p>
            <p><span class="label">Created:</span> ${new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          
          <div class="ticket-info">
            <h2>Customer Information</h2>
            <p><span class="label">Name:</span> ${ticket.customerName}</p>
            <p><span class="label">Email:</span> ${ticket.customerEmail}</p>
            ${ticket.company ? `<p><span class="label">Company:</span> ${ticket.company}</p>` : ''}
          </div>
          
          <div class="ticket-info">
            <h2>Description</h2>
            <p>${ticket.description}</p>
          </div>
          
          <div class="actions">
            <a href="#" class="button">View Ticket</a>
            <a href="#" class="button">Reply to Customer</a>
          </div>
        </body>
        </html>
      `,
      text: `
        New Support Ticket Received
        
        Ticket ID: #${ticket.id}
        Subject: ${ticket.subject}
        Severity: ${ticket.severity.toUpperCase()}
        Category: ${ticket.category}
        Status: ${ticket.status}
        Created: ${new Date(ticket.createdAt).toLocaleString()}
        
        Customer Information:
        Name: ${ticket.customerName}
        Email: ${ticket.customerEmail}
        ${ticket.company ? `Company: ${ticket.company}` : ''}
        
        Description:
        ${ticket.description}
        
        Please log in to the admin dashboard to view and respond to this ticket.
      `
    };
  }

  private static generateCustomerConfirmationTemplate(ticket: SupportTicket): EmailTemplate {
    return {
      subject: `Support Ticket Confirmation - #${ticket.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Support Ticket Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .ticket-info { background-color: #ffffff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .label { font-weight: bold; color: #495057; }
            .response-times { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Thank You for Contacting Support</h1>
            <p>We've received your support ticket and will respond as soon as possible.</p>
          </div>
          
          <div class="ticket-info">
            <h2>Your Ticket Details</h2>
            <p><span class="label">Ticket ID:</span> #${ticket.id}</p>
            <p><span class="label">Subject:</span> ${ticket.subject}</p>
            <p><span class="label">Severity:</span> ${ticket.severity}</p>
            <p><span class="label">Category:</span> ${ticket.category}</p>
            <p><span class="label">Submitted:</span> ${new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          
          <div class="response-times">
            <h3>Expected Response Times</h3>
            <ul>
              <li><strong>Critical:</strong> Within 1 hour</li>
              <li><strong>High:</strong> Within 4 hours</li>
              <li><strong>Medium:</strong> Within 24 hours</li>
              <li><strong>Low:</strong> Within 48 hours</li>
            </ul>
          </div>
          
          <p>If you need to add more information to your ticket, please reply to this email with your ticket ID (#${ticket.id}) in the subject line.</p>
          
          <p>Best regards,<br>
          The Support Team<br>
          marketing-support@bobbiedigital.com</p>
        </body>
        </html>
      `,
      text: `
        Thank You for Contacting Support
        
        We've received your support ticket and will respond as soon as possible.
        
        Your Ticket Details:
        Ticket ID: #${ticket.id}
        Subject: ${ticket.subject}
        Severity: ${ticket.severity}
        Category: ${ticket.category}
        Submitted: ${new Date(ticket.createdAt).toLocaleString()}
        
        Expected Response Times:
        - Critical: Within 1 hour
        - High: Within 4 hours
        - Medium: Within 24 hours
        - Low: Within 48 hours
        
        If you need to add more information to your ticket, please reply to this email with your ticket ID (#${ticket.id}) in the subject line.
        
        Best regards,
        The Support Team
        marketing-support@bobbiedigital.com
      `
    };
  }

  private static generateTicketResponseTemplate(ticket: SupportTicket, response: SupportResponse): EmailTemplate {
    return {
      subject: `Re: Support Ticket #${ticket.id} - ${ticket.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Support Ticket Response</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .response { background-color: #ffffff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .label { font-weight: bold; color: #495057; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Support Team Response</h1>
            <p>We've responded to your support ticket. Here's our update:</p>
          </div>
          
          <div class="response">
            <h2>Ticket #${ticket.id}</h2>
            <p><span class="label">Subject:</span> ${ticket.subject}</p>
            <p><span class="label">Status:</span> ${ticket.status}</p>
            <p><span class="label">Response Date:</span> ${new Date(response.createdAt).toLocaleString()}</p>
            
            <hr>
            
            <h3>Our Response:</h3>
            <p>${response.message}</p>
          </div>
          
          <p>If you have any follow-up questions, please reply to this email.</p>
          
          <p>Best regards,<br>
          The Support Team<br>
          marketing-support@bobbiedigital.com</p>
        </body>
        </html>
      `,
      text: `
        Support Team Response
        
        We've responded to your support ticket. Here's our update:
        
        Ticket #${ticket.id}
        Subject: ${ticket.subject}
        Status: ${ticket.status}
        Response Date: ${new Date(response.createdAt).toLocaleString()}
        
        Our Response:
        ${response.message}
        
        If you have any follow-up questions, please reply to this email.
        
        Best regards,
        The Support Team
        marketing-support@bobbiedigital.com
      `
    };
  }

  private static getPriorityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }
}
