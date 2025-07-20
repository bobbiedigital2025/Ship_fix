import { useState } from 'react';
import { ResendEmailService } from '@/api/email-service';
import { type EmailData } from '@/api/email';

interface EmailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  emailId?: string;
}

/**
 * Hook for sending emails with loading states
 */
export function useEmail() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    success: false,
    error: null
  });

  const sendEmail = async (emailData: EmailData) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendCustomEmail(emailData);
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
        return result;
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send email' 
        });
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const reset = () => {
    setState({ loading: false, success: false, error: null });
  };

  return {
    ...state,
    sendEmail,
    reset
  };
}

/**
 * Hook for sending welcome emails
 */
export function useWelcomeEmail() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    success: false,
    error: null
  });

  const sendWelcomeEmail = async (userEmail: string, userName: string) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendWelcomeEmail(userEmail, userName);
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send welcome email' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    sendWelcomeEmail
  };
}

/**
 * Hook for sending support ticket emails
 */
export function useSupportEmail() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    success: false,
    error: null
  });

  const sendSupportConfirmation = async (
    customerEmail: string, 
    customerName: string, 
    ticketId: string, 
    subject: string
  ) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendSupportTicketConfirmation(
        customerEmail, 
        customerName, 
        ticketId, 
        subject
      );
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send support email' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const notifySupportTeam = async (
    subject: string, 
    message: string, 
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.notifySupportTeam(subject, message, priority);
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to notify support team' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    sendSupportConfirmation,
    notifySupportTeam
  };
}

/**
 * Hook for sending notifications
 */
export function useNotificationEmail() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    success: false,
    error: null
  });

  const sendNotification = async (
    recipient: string, 
    title: string, 
    message: string, 
    actionUrl?: string
  ) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendNotification(
        recipient, 
        title, 
        message, 
        actionUrl
      );
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send notification' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const sendBulkNotifications = async (
    recipients: string[], 
    title: string, 
    message: string
  ) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendBulkNotifications(
        recipients, 
        title, 
        message
      );
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null 
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send bulk notifications' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    sendNotification,
    sendBulkNotifications
  };
}

/**
 * Hook for order confirmation emails
 */
export function useOrderEmail() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    success: false,
    error: null
  });

  const sendOrderConfirmation = async (
    customerEmail: string, 
    customerName: string, 
    orderId: string, 
    orderDetails: any
  ) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendOrderConfirmation(
        customerEmail, 
        customerName, 
        orderId, 
        orderDetails
      );
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send order confirmation' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    sendOrderConfirmation
  };
}

/**
 * Hook for password reset emails
 */
export function usePasswordResetEmail() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    success: false,
    error: null
  });

  const sendPasswordReset = async (
    userEmail: string, 
    resetUrl: string, 
    userName?: string
  ) => {
    setState({ loading: true, success: false, error: null });
    
    try {
      const result = await ResendEmailService.sendPasswordReset(
        userEmail, 
        resetUrl, 
        userName
      );
      
      if (result.success) {
        setState({ 
          loading: false, 
          success: true, 
          error: null,
          emailId: (result.data as any)?.id
        });
      } else {
        setState({ 
          loading: false, 
          success: false, 
          error: result.error || 'Failed to send password reset email' 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ 
        loading: false, 
        success: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    sendPasswordReset
  };
}
