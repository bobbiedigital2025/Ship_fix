import { SupportTicket, SupportStats, FAQ, CustomerProfile } from '@/types/support';
import { EmailService } from './email-service';

// Mock data for demonstration
const mockTickets: SupportTicket[] = [
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
    // Simulate API call
    return new Promise(async (resolve, reject) => {
      try {
        const newTicket: SupportTicket = {
          ...ticket,
          id: Date.now().toString(),
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Send email notifications
        await EmailService.sendSupportTicketNotification(newTicket);
        await EmailService.sendCustomerConfirmation(newTicket);
        
        setTimeout(() => resolve(newTicket), 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getTickets(): Promise<SupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTickets), 500);
    });
  }

  static async getTicketsByCategory(category: string): Promise<SupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockTickets.filter(t => t.category === category);
        resolve(filtered);
      }, 500);
    });
  }

  static async getTicketsBySeverity(severity: string): Promise<SupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockTickets.filter(t => t.severity === severity);
        resolve(filtered);
      }, 500);
    });
  }

  static async getCustomersBySeverity(severity: string): Promise<CustomerProfile[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketsWithSeverity = mockTickets.filter(t => t.severity === severity);
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
          totalTickets: mockTickets.length,
          openTickets: mockTickets.filter(t => t.status === 'open').length,
          averageResponseTime: 2.5,
          satisfactionScore: 4.4,
          ticketsByCategory: {
            technical: mockTickets.filter(t => t.category === 'technical').length,
            billing: mockTickets.filter(t => t.category === 'billing').length,
            integration: mockTickets.filter(t => t.category === 'integration').length,
            account: mockTickets.filter(t => t.category === 'account').length,
            general: mockTickets.filter(t => t.category === 'general').length,
          },
          ticketsBySeverity: {
            low: mockTickets.filter(t => t.severity === 'low').length,
            medium: mockTickets.filter(t => t.severity === 'medium').length,
            high: mockTickets.filter(t => t.severity === 'high').length,
            critical: mockTickets.filter(t => t.severity === 'critical').length,
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

  static async sendEmailNotification(ticket: SupportTicket): Promise<void> {
    // This is now handled in the createTicket method
    try {
      await EmailService.sendSupportTicketNotification(ticket);
      console.log(`Email sent to marketing-support@bobbiedigital.com for ticket ${ticket.id}`);
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
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
