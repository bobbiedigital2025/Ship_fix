export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  company?: string;
  category: 'billing' | 'technical' | 'account' | 'integration' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: number;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  responses?: SupportResponse[];
  attachments?: string[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  author: string;
  message: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  averageResponseTime: number;
  satisfactionScore: number;
  ticketsByCategory: Record<string, number>;
  ticketsBySeverity: Record<string, number>;
  customersByTier: Record<string, string[]>;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  tier: 'basic' | 'premium' | 'enterprise';
  totalTickets: number;
  openTickets: number;
  avgResponseTime: number;
  satisfactionScore: number;
  joinDate: Date;
  lastActivity: Date;
}
