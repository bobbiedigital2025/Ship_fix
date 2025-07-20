import { SupportTicket, SupportStats, FAQ, CustomerProfile } from '@/types/support';
import { MCPCommunicationService, MCPAuthService } from './mcp-auth-service';
import { ResendEmailService } from '@/api/email-service';

// In-memory storage for tickets (in production, this would be a database)
let ticketStorage: SupportTicket[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@company.com',
    company: 'Acme Corp',
    category: 'technical',
    severity: 'high',
    subject: 'API Integration Issues',
    description: 'Having trouble with webhook authentication',
    status: 'open',
    priority: 8,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@startup.com',
    company: 'StartupCo',
    category: 'billing',
    severity: 'medium',
    subject: 'Billing Question',
    description: 'Question about subscription pricing',
    status: 'in-progress',
    priority: 5,
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
  },
  {
    id: '3',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@enterprise.com',
    company: 'Enterprise Ltd',
    category: 'integration',
    severity: 'critical',
    subject: 'System Down',
    description: 'Complete system outage affecting production',
    status: 'open',
    priority: 10,
    createdAt: new Date('2025-01-16'),
    updatedAt: new Date('2025-01-16'),
  },
];

const mockCustomers: CustomerProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    company: 'Acme Corp',
    tier: 'premium',
    totalTickets: 5,
    openTickets: 1,
    avgResponseTime: 2.5,
    satisfactionScore: 4.5,
    joinDate: new Date('2024-06-01'),
    lastActivity: new Date('2025-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@startup.com',
    company: 'StartupCo',
    tier: 'basic',
    totalTickets: 3,
    openTickets: 1,
    avgResponseTime: 4.0,
    satisfactionScore: 4.0,
    joinDate: new Date('2024-08-15'),
    lastActivity: new Date('2025-01-14'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@enterprise.com',
    company: 'Enterprise Ltd',
    tier: 'enterprise',
    totalTickets: 12,
    openTickets: 1,
    avgResponseTime: 1.0,
    satisfactionScore: 4.8,
    joinDate: new Date('2024-01-01'),
    lastActivity: new Date('2025-01-16'),
  },
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I integrate the API?',
    answer: 'You can integrate our API by following the documentation...',
    category: 'integration',
    isPublic: true,
    viewCount: 156,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    question: 'What are the billing cycles?',
    answer: 'We offer monthly and annual billing cycles...',
    category: 'billing',
    isPublic: true,
    viewCount: 89,
    createdAt: new Date('2024-12-05'),
  },
];

export class SupportService {
  static async createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<SupportTicket> {
    return new Promise((resolve, reject) => {
      const processTicket = async () => {
        try {
          // Generate unique ID
          const id = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          const newTicket: SupportTicket = {
            ...ticket,
            id,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Add to storage (this persists the ticket!)
          ticketStorage.unshift(newTicket); // Add to beginning for newest first
          
          console.log('🎫 New support ticket created:', {
            id: newTicket.id,
            subject: newTicket.subject,
            customerEmail: newTicket.customerEmail,
            severity: newTicket.severity,
            category: newTicket.category
          });

          // Trigger real-time notification for admin dashboard
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('new-support-ticket', { detail: newTicket });
            window.dispatchEvent(event);
          }
          
          // Send email notifications using Resend
          try {
            // Send confirmation to customer
            await ResendEmailService.sendSupportTicketConfirmation(
              newTicket.customerEmail,
              newTicket.customerName,
              newTicket.id,
              newTicket.subject
            );
            
            // Notify support team
            const priorityLevel = newTicket.severity === 'critical' || newTicket.severity === 'high' ? 'high' : 
                                newTicket.severity === 'medium' ? 'medium' : 'low';
            
            await ResendEmailService.notifySupportTeam(
              `New ${newTicket.severity.toUpperCase()} Support Ticket: ${newTicket.subject}`,
              `
                A new support ticket has been submitted and requires attention.
                
                **Ticket Details:**
                - ID: ${newTicket.id}
                - Customer: ${newTicket.customerName} (${newTicket.customerEmail})
                - Company: ${newTicket.company || 'Not specified'}
                - Category: ${newTicket.category}
                - Severity: ${newTicket.severity}
                - Subject: ${newTicket.subject}
                
                **Description:**
                ${newTicket.description}
                
                **Created:** ${newTicket.createdAt.toLocaleString()}
                
                Please review and respond promptly based on the severity level.
              `,
              priorityLevel
            );
            
            console.log('✅ Email notifications sent successfully');
          } catch (emailError) {
            console.warn('⚠️ Email notification failed:', emailError);
            // Don't fail the ticket creation if email fails
          }
          
          // Try MCP notifications (with fallback for development)
          try {
            const isAuthenticated = await MCPAuthService.validateSession();
            if (!isAuthenticated) {
              await MCPAuthService.authenticateAgent('support-app', {
                appId: 'supply-chain-platform',
                secret: 'development-secret'
              });
            }
            
            await MCPCommunicationService.sendSupportTicketNotification(newTicket);
            await MCPCommunicationService.sendCustomerConfirmation(newTicket);
            console.log('✅ MCP notifications sent successfully');
          } catch (mcpError) {
            console.warn('⚠️ MCP communication failed (this is normal in development):', mcpError);
          }
          
          // Simulate network delay
          setTimeout(() => resolve(newTicket), 1000);
        } catch (error) {
          reject(error);
        }
      };
      
      processTicket();
    });
  }

  static async getTickets(): Promise<SupportTicket[]> {
    return new Promise((resolve) => {
      // Return current tickets from storage (including newly submitted ones)
      setTimeout(() => {
        console.log(`📊 Fetching ${ticketStorage.length} tickets for admin dashboard`);
        resolve([...ticketStorage]); // Return a copy to prevent mutations
      }, 500);
    });
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = ticketStorage.find(t => t.id === id);
        resolve(ticket || null);
      }, 300);
    });
  }

  static async updateTicketStatus(id: string, status: 'open' | 'in-progress' | 'resolved' | 'closed'): Promise<SupportTicket | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = ticketStorage.findIndex(t => t.id === id);
        if (ticketIndex !== -1) {
          ticketStorage[ticketIndex] = {
            ...ticketStorage[ticketIndex],
            status,
            updatedAt: new Date()
          };
          console.log(`🔄 Ticket ${id} status updated to: ${status}`);
          resolve(ticketStorage[ticketIndex]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  static async deleteTicket(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = ticketStorage.length;
        ticketStorage = ticketStorage.filter(t => t.id !== id);
        const wasDeleted = ticketStorage.length < initialLength;
        if (wasDeleted) {
          console.log(`🗑️ Ticket ${id} deleted successfully`);
        }
        resolve(wasDeleted);
      }, 300);
    });
  }

  // Enhanced method to send email notifications using our Resend integration
  static async sendEmailNotification(ticket: SupportTicket): Promise<void> {
    try {
      // Send confirmation to customer
      await ResendEmailService.sendSupportTicketConfirmation(
        ticket.customerEmail,
        ticket.customerName,
        ticket.id,
        ticket.subject
      );
      
      // Notify support team with appropriate priority
      const priorityLevel = ticket.severity === 'critical' || ticket.severity === 'high' ? 'high' : 
                          ticket.severity === 'medium' ? 'medium' : 'low';
      
      await ResendEmailService.notifySupportTeam(
        `Support Ticket ${ticket.id}: ${ticket.subject}`,
        `New ${ticket.severity} priority ticket from ${ticket.customerName} (${ticket.customerEmail})`,
        priorityLevel
      );
      
      console.log('📧 Email notifications sent for ticket:', ticket.id);
    } catch (error) {
      console.error('❌ Failed to send email notifications:', error);
      throw error;
    }
  }

  static async getTicketsByCategory(category: string): Promise<SupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = ticketStorage.filter(t => t.category === category);
        resolve(filtered);
      }, 500);
    });
  }

  static async getTicketsBySeverity(severity: string): Promise<SupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = ticketStorage.filter(t => t.severity === severity);
        resolve(filtered);
      }, 500);
    });
  }

  static async getCustomersBySeverity(severity: string): Promise<CustomerProfile[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketsWithSeverity = ticketStorage.filter(t => t.severity === severity);
        const customerEmails = ticketsWithSeverity.map(t => t.customerEmail);
        const customers = mockCustomers.filter(c => customerEmails.includes(c.email));
        resolve(customers);
      }, 500);
    });
  }

  static async getSupportStats(): Promise<SupportStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: SupportStats = {
          totalTickets: ticketStorage.length,
          openTickets: ticketStorage.filter(t => t.status === 'open').length,
          averageResponseTime: 2.5,
          satisfactionScore: 4.4,
          ticketsByCategory: {
            technical: ticketStorage.filter(t => t.category === 'technical').length,
            billing: ticketStorage.filter(t => t.category === 'billing').length,
            integration: ticketStorage.filter(t => t.category === 'integration').length,
            account: ticketStorage.filter(t => t.category === 'account').length,
            general: ticketStorage.filter(t => t.category === 'general').length,
          },
          ticketsBySeverity: {
            low: ticketStorage.filter(t => t.severity === 'low').length,
            medium: ticketStorage.filter(t => t.severity === 'medium').length,
            high: ticketStorage.filter(t => t.severity === 'high').length,
            critical: ticketStorage.filter(t => t.severity === 'critical').length,
          },
          customersByTier: {
            basic: mockCustomers.filter(c => c.tier === 'basic').map(c => c.name),
            premium: mockCustomers.filter(c => c.tier === 'premium').map(c => c.name),
            enterprise: mockCustomers.filter(c => c.tier === 'enterprise').map(c => c.name),
          },
        };
        resolve(stats);
      }, 500);
    });
  }

  static async getFAQs(): Promise<FAQ[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFAQs), 300);
    });
  }

  static getPriorityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in-progress': return 'text-purple-600 bg-purple-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }
}
