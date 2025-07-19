import { mcpClient } from './mcp-client';
import { SupportTicket, SupportResponse } from '@/types/support';

// MCP A2A Authentication Service
export class MCPAuthService {
  private static readonly AUTH_SERVER_URL = 'mcp://auth.bobbiedigital.com';
  private static readonly SESSION_STORAGE_KEY = 'mcp_auth_session';

  static async authenticateAgent(agentId: string, credentials: Record<string, unknown>): Promise<string> {
    try {
      const response = await mcpClient.invokeTool(
        this.AUTH_SERVER_URL,
        'authenticate_agent',
        {
          agentId,
          credentials,
          timestamp: Date.now(),
          sessionType: 'a2a'
        }
      ) as { sessionToken: string; expiresAt: number };

      // Store session token for future requests
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify({
        token: response.sessionToken,
        expiresAt: response.expiresAt,
        agentId
      }));

      return response.sessionToken;
    } catch (error) {
      console.error('MCP Authentication failed:', error);
      throw new Error('Failed to authenticate with MCP server');
    }
  }

  static async getSessionToken(): Promise<string | null> {
    try {
      const storedSession = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (!storedSession) return null;

      const session = JSON.parse(storedSession);
      if (Date.now() > session.expiresAt) {
        sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
        return null;
      }

      return session.token;
    } catch (error) {
      console.error('Error retrieving session token:', error);
      return null;
    }
  }

  static async refreshSession(): Promise<string | null> {
    try {
      const storedSession = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (!storedSession) return null;

      const session = JSON.parse(storedSession);
      
      const response = await mcpClient.invokeTool(
        this.AUTH_SERVER_URL,
        'refresh_session',
        {
          sessionToken: session.token,
          agentId: session.agentId
        }
      ) as { sessionToken: string; expiresAt: number };

      // Update stored session
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify({
        token: response.sessionToken,
        expiresAt: response.expiresAt,
        agentId: session.agentId
      }));

      return response.sessionToken;
    } catch (error) {
      console.error('Failed to refresh MCP session:', error);
      return null;
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      const token = await this.getSessionToken();
      if (!token) return false;

      const response = await mcpClient.invokeTool(
        this.AUTH_SERVER_URL,
        'validate_session',
        { sessionToken: token }
      ) as { valid: boolean };

      return response.valid;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = await this.getSessionToken();
      if (token) {
        await mcpClient.invokeTool(
          this.AUTH_SERVER_URL,
          'revoke_session',
          { sessionToken: token }
        );
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    }
  }
}

// MCP Communication Service for Email and Notifications
export class MCPCommunicationService {
  private static readonly COMM_SERVER_URL = 'mcp://communication.bobbiedigital.com';

  static async sendSupportTicketNotification(ticket: SupportTicket): Promise<void> {
    try {
      const sessionToken = await MCPAuthService.getSessionToken();
      if (!sessionToken) {
        throw new Error('No valid session token for MCP communication');
      }

      await mcpClient.invokeTool(
        this.COMM_SERVER_URL,
        'send_notification',
        {
          sessionToken,
          type: 'support_ticket_created',
          recipient: 'marketing-support@bobbiedigital.com',
          data: {
            ticketId: ticket.id,
            subject: ticket.subject,
            severity: ticket.severity,
            category: ticket.category,
            customerName: ticket.customerName,
            customerEmail: ticket.customerEmail,
            company: ticket.company,
            description: ticket.description,
            createdAt: ticket.createdAt,
            priority: ticket.priority
          },
          template: 'support_team_notification',
          urgency: this.getSeverityUrgency(ticket.severity)
        }
      );

      console.log(`Support ticket notification sent via MCP for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send support ticket notification via MCP:', error);
      throw error;
    }
  }

  static async sendCustomerConfirmation(ticket: SupportTicket): Promise<void> {
    try {
      const sessionToken = await MCPAuthService.getSessionToken();
      if (!sessionToken) {
        throw new Error('No valid session token for MCP communication');
      }

      await mcpClient.invokeTool(
        this.COMM_SERVER_URL,
        'send_notification',
        {
          sessionToken,
          type: 'support_ticket_confirmation',
          recipient: ticket.customerEmail,
          data: {
            ticketId: ticket.id,
            subject: ticket.subject,
            severity: ticket.severity,
            category: ticket.category,
            customerName: ticket.customerName,
            createdAt: ticket.createdAt,
            expectedResponseTime: this.getResponseTime(ticket.severity)
          },
          template: 'customer_confirmation',
          urgency: 'normal'
        }
      );

      console.log(`Customer confirmation sent via MCP for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send customer confirmation via MCP:', error);
      throw error;
    }
  }

  static async sendTicketResponse(ticket: SupportTicket, response: SupportResponse): Promise<void> {
    try {
      const sessionToken = await MCPAuthService.getSessionToken();
      if (!sessionToken) {
        throw new Error('No valid session token for MCP communication');
      }

      await mcpClient.invokeTool(
        this.COMM_SERVER_URL,
        'send_notification',
        {
          sessionToken,
          type: 'support_ticket_response',
          recipient: ticket.customerEmail,
          data: {
            ticketId: ticket.id,
            subject: ticket.subject,
            status: ticket.status,
            customerName: ticket.customerName,
            response: {
              message: response.message,
              createdAt: response.createdAt,
              author: response.author || 'Support Team'
            }
          },
          template: 'ticket_response',
          urgency: 'normal'
        }
      );

      console.log(`Ticket response sent via MCP for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send ticket response via MCP:', error);
      throw error;
    }
  }

  static async sendBulkNotification(recipients: string[], message: string, type: string): Promise<void> {
    try {
      const sessionToken = await MCPAuthService.getSessionToken();
      if (!sessionToken) {
        throw new Error('No valid session token for MCP communication');
      }

      await mcpClient.invokeTool(
        this.COMM_SERVER_URL,
        'send_bulk_notification',
        {
          sessionToken,
          recipients,
          type,
          data: { message },
          template: 'bulk_notification',
          urgency: 'normal'
        }
      );

      console.log(`Bulk notification sent via MCP to ${recipients.length} recipients`);
    } catch (error) {
      console.error('Failed to send bulk notification via MCP:', error);
      throw error;
    }
  }

  private static getSeverityUrgency(severity: string): string {
    switch (severity) {
      case 'critical': return 'urgent';
      case 'high': return 'high';
      case 'medium': return 'normal';
      case 'low': return 'low';
      default: return 'normal';
    }
  }

  private static getResponseTime(severity: string): string {
    switch (severity) {
      case 'critical': return 'Within 1 hour';
      case 'high': return 'Within 4 hours';
      case 'medium': return 'Within 24 hours';
      case 'low': return 'Within 48 hours';
      default: return 'Within 24 hours';
    }
  }
}
