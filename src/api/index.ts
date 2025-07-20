// Email API exports
export * from './email';
export * from './email-service';

// Re-export commonly used functions
export { 
  sendEmail, 
  sendBatchEmails, 
  getEmailStatus, 
  updateScheduledEmail, 
  cancelEmail,
  emailTemplates 
} from './email';

export { ResendEmailService } from './email-service';
