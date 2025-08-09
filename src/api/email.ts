import { Resend } from 'resend';
import { validateData, emailDataSchema, validateEnvironment } from '@/lib/validation';
import { 
  safeAsync, 
  withRetryAndTimeout, 
  createErrorResponse, 
  createSuccessResponse,
  logError,
  type ApiResponse 
} from '@/lib/error-handling';

// Validate environment variables on module load
const envValidation = validateEnvironment();
if (!envValidation.success) {
  console.error('Environment validation failed:', envValidation.error);
}

// Initialize Resend with API key from environment
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || 'demo-key';
if (resendApiKey === 'demo-key') {
  console.warn('Using demo Resend API key - emails will not be sent in production');
}

const resend = new Resend(resendApiKey);

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

// Rate limiting (simple in-memory implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter();

/**
 * Send a single email with validation and error handling
 */
export async function sendEmail(emailData: EmailData): Promise<ApiResponse<unknown>> {
  // Validate input data
  const validation = validateData(emailDataSchema, emailData);
  if (!validation.success) {
    logError('Email validation failed', validation.error, { emailData });
    return createErrorResponse(
      'Invalid email data',
      { message: validation.error, code: 'VALIDATION_ERROR' }
    );
  }

  const validatedData = validation.data;

  // Check rate limiting
  const rateLimitKey = Array.isArray(validatedData.to) 
    ? validatedData.to.join(',') 
    : validatedData.to;
    
  if (!rateLimiter.isAllowed(rateLimitKey)) {
    logError('Rate limit exceeded', 'Too many email requests', { to: rateLimitKey });
    return createErrorResponse(
      'Rate limit exceeded. Please try again later.',
      { message: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }
    );
  }

  return safeAsync(async () => {
    return await withRetryAndTimeout(async () => {
      const response = await resend.emails.send({
        from: validatedData.from || DEFAULT_FROM,
        to: validatedData.to,
        subject: validatedData.subject,
        html: validatedData.html,
        text: validatedData.text,
      });

      console.log('Email sent successfully:', response);
      return response;
    }, {
      maxRetries: 3,
      timeoutMs: 30000,
      timeoutMessage: 'Email sending timed out'
    });
  }, 'Failed to send email');
}

/**
 * Send batch emails with validation and error handling
 */
export async function sendBatchEmails(batchData: BatchEmailData): Promise<ApiResponse<unknown>> {
  // Validate that we have emails to send
  if (!batchData.emails || batchData.emails.length === 0) {
    return createErrorResponse(
      'No emails provided for batch sending',
      { message: 'Empty batch', code: 'EMPTY_BATCH' }
    );
  }

  // Validate each email in the batch
  const validatedEmails: EmailData[] = [];
  const validationErrors: string[] = [];

  for (let i = 0; i < batchData.emails.length; i++) {
    const validation = validateData(emailDataSchema, batchData.emails[i]);
    if (!validation.success) {
      validationErrors.push(`Email ${i + 1}: ${validation.error}`);
    } else {
      validatedEmails.push(validation.data);
    }
  }

  if (validationErrors.length > 0) {
    logError('Batch email validation failed', validationErrors, { batchSize: batchData.emails.length });
    return createErrorResponse(
      'Validation failed for some emails in batch',
      { 
        message: validationErrors.join('; '), 
        code: 'BATCH_VALIDATION_ERROR',
        details: validationErrors 
      }
    );
  }

  return safeAsync(async () => {
    return await withRetryAndTimeout(async () => {
      const emailsToSend = validatedEmails.map(email => ({
        from: email.from || DEFAULT_FROM,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }));

      const response = await resend.batch.send(emailsToSend);

      console.log('Batch emails sent successfully:', response);
      return response;
    }, {
      maxRetries: 2, // Fewer retries for batch operations
      timeoutMs: 60000, // Longer timeout for batch
      timeoutMessage: 'Batch email sending timed out'
    });
  }, 'Failed to send batch emails');
}

/**
 * Get email status by ID with validation
 */
export async function getEmailStatus(emailId: string): Promise<ApiResponse<unknown>> {
  // Validate email ID
  if (!emailId || typeof emailId !== 'string' || emailId.trim().length === 0) {
    return createErrorResponse(
      'Invalid email ID provided',
      { message: 'Email ID is required and must be a non-empty string', code: 'INVALID_EMAIL_ID' }
    );
  }

  return safeAsync(async () => {
    return await withRetryAndTimeout(async () => {
      const response = await resend.emails.get(emailId.trim());
      return response;
    }, {
      maxRetries: 2,
      timeoutMs: 15000,
      timeoutMessage: 'Email status retrieval timed out'
    });
  }, 'Failed to get email status');
}

/**
 * Update scheduled email with validation
 */
export async function updateScheduledEmail(emailId: string, scheduledAt: string): Promise<ApiResponse<unknown>> {
  // Validate inputs
  if (!emailId || typeof emailId !== 'string' || emailId.trim().length === 0) {
    return createErrorResponse(
      'Invalid email ID provided',
      { message: 'Email ID is required', code: 'INVALID_EMAIL_ID' }
    );
  }

  // Validate scheduledAt is a valid ISO string
  const scheduledDate = new Date(scheduledAt);
  if (isNaN(scheduledDate.getTime())) {
    return createErrorResponse(
      'Invalid scheduled date provided',
      { message: 'Scheduled date must be a valid ISO string', code: 'INVALID_DATE' }
    );
  }

  // Check if the scheduled date is in the future
  if (scheduledDate <= new Date()) {
    return createErrorResponse(
      'Scheduled date must be in the future',
      { message: 'Cannot schedule emails for past dates', code: 'PAST_DATE' }
    );
  }

  return safeAsync(async () => {
    return await withRetryAndTimeout(async () => {
      const response = await resend.emails.update({
        id: emailId.trim(),
        scheduledAt: scheduledDate.toISOString(),
      });
      return response;
    }, {
      maxRetries: 2,
      timeoutMs: 15000,
      timeoutMessage: 'Email update timed out'
    });
  }, 'Failed to update email');
}

/**
 * Cancel scheduled email with validation
 */
export async function cancelEmail(emailId: string): Promise<ApiResponse<unknown>> {
  // Validate email ID
  if (!emailId || typeof emailId !== 'string' || emailId.trim().length === 0) {
    return createErrorResponse(
      'Invalid email ID provided',
      { message: 'Email ID is required', code: 'INVALID_EMAIL_ID' }
    );
  }

  return safeAsync(async () => {
    return await withRetryAndTimeout(async () => {
      const response = await resend.emails.cancel(emailId.trim());
      return response;
    }, {
      maxRetries: 2,
      timeoutMs: 15000,
      timeoutMessage: 'Email cancellation timed out'
    });
  }, 'Failed to cancel email');
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
