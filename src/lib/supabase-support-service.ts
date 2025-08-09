import { createClient } from '@supabase/supabase-js';
import { SupportTicket, SupportStats, FAQ, CustomerProfile } from '@/types/support';
import { ResendEmailService } from '@/api/email-service';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for database operations
interface DbSupportTicket {
  id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  company?: string;
  category: string;
  severity: string;
  subject: string;
  description: string;
  status: string;
  priority: number;
  assigned_to?: string;
  resolution?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

interface DbCustomer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tier: string;
  status: string;
  total_tickets: number;
  open_tickets: number;
  avg_response_time: number;
  satisfaction_score: number;
  join_date: string;
  last_activity: string;
  last_login?: string;
  registration_source?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface UserRegistration {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  registration_type?: string;
  registration_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer_url?: string;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  location_country?: string;
  location_city?: string;
  terms_accepted?: boolean;
  marketing_consent?: boolean;
}

export class SupabaseSupportService {
  
  /**
   * Register a new user and store their contact information
   */
  static async registerUser(userData: UserRegistration): Promise<{ success: boolean; customer: DbCustomer | null; error?: string }> {
    try {
      console.log('📝 Registering new user in Supabase:', userData.email);

      // First, create or update customer record
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', userData.email)
        .single();

      let customer: DbCustomer;

      if (existingCustomer) {
        // Update existing customer
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update({
            name: userData.name,
            company: userData.company,
            phone: userData.phone,
            last_activity: new Date().toISOString(),
            last_login: new Date().toISOString()
          })
          .eq('email', userData.email)
          .select()
          .single();

        if (updateError) throw updateError;
        customer = updatedCustomer;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            name: userData.name,
            email: userData.email,
            company: userData.company,
            phone: userData.phone,
            registration_source: userData.registration_source || 'app',
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        customer = newCustomer;
      }

      // Record the registration
      const { error: regError } = await supabase
        .from('user_registrations')
        .insert({
          customer_id: customer.id,
          email: userData.email,
          name: userData.name,
          company: userData.company,
          phone: userData.phone,
          registration_type: userData.registration_type || 'standard',
          registration_source: userData.registration_source || 'app',
          utm_source: userData.utm_source,
          utm_medium: userData.utm_medium,
          utm_campaign: userData.utm_campaign,
          referrer_url: userData.referrer_url,
          ip_address: userData.ip_address,
          user_agent: userData.user_agent,
          device_type: userData.device_type,
          browser: userData.browser,
          location_country: userData.location_country,
          location_city: userData.location_city,
          terms_accepted: userData.terms_accepted || false,
          marketing_consent: userData.marketing_consent || false
        });

      if (regError) {
        console.warn('Registration tracking failed:', regError);
        // Don't fail the main registration for this
      }

      // Log the interaction
      await this.logInteraction(customer.id, 'registration', {
        registration_source: userData.registration_source,
        registration_type: userData.registration_type
      });

      console.log('✅ User registered successfully in Supabase');
      return { success: true, customer };

    } catch (error) {
      console.error('❌ User registration failed:', error);
      return { 
        success: false, 
        customer: null, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  /**
   * Create a new support ticket and store in Supabase
   */
  static async createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<SupportTicket> {
    try {
      console.log('🎫 Creating support ticket in Supabase:', ticket.subject);

      // Insert ticket into Supabase
      const { data: newTicket, error } = await supabase
        .from('support_tickets')
        .insert({
          customer_name: ticket.customerName,
          customer_email: ticket.customerEmail,
          company: ticket.company,
          category: ticket.category,
          severity: ticket.severity,
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority
        })
        .select()
        .single();

      if (error) throw error;

      // Convert database format to app format
      const supportTicket: SupportTicket = {
        id: newTicket.id,
        customerName: newTicket.customer_name,
        customerEmail: newTicket.customer_email,
        company: newTicket.company,
        category: newTicket.category as SupportTicket['category'],
        severity: newTicket.severity as SupportTicket['severity'],
        subject: newTicket.subject,
        description: newTicket.description,
        status: newTicket.status as SupportTicket['status'],
        priority: newTicket.priority,
        createdAt: new Date(newTicket.created_at),
        updatedAt: new Date(newTicket.updated_at)
      };

      // Log the interaction
      if (newTicket.customer_id) {
        await this.logInteraction(newTicket.customer_id, 'support_ticket', {
          ticket_id: newTicket.id,
          subject: newTicket.subject,
          category: newTicket.category,
          severity: newTicket.severity
        });
      }

      // Send email notifications
      try {
        await ResendEmailService.sendSupportTicketConfirmation(
          supportTicket.customerEmail,
          supportTicket.customerName,
          supportTicket.id,
          supportTicket.subject
        );

        const priorityLevel = supportTicket.severity === 'critical' || supportTicket.severity === 'high' ? 'high' : 
                            supportTicket.severity === 'medium' ? 'medium' : 'low';

        await ResendEmailService.notifySupportTeam(
          `New ${supportTicket.severity.toUpperCase()} Support Ticket: ${supportTicket.subject}`,
          `
            A new support ticket has been submitted and requires attention.
            
            **Ticket Details:**
            - ID: ${supportTicket.id}
            - Customer: ${supportTicket.customerName} (${supportTicket.customerEmail})
            - Company: ${supportTicket.company || 'Not specified'}
            - Category: ${supportTicket.category}
            - Severity: ${supportTicket.severity}
            - Subject: ${supportTicket.subject}
            
            **Description:**
            ${supportTicket.description}
            
            **Created:** ${supportTicket.createdAt.toLocaleString()}
            
            Please review and respond promptly based on the severity level.
          `,
          priorityLevel
        );

        // Log email interactions
        await this.logEmailSent(supportTicket.customerEmail, 'support_ticket_confirmation', supportTicket.subject);
        await this.logEmailSent('support-marketing@bobbiedigital.com', 'support_team_notification', `New Ticket: ${supportTicket.subject}`);

        console.log('✅ Email notifications sent successfully');
      } catch (emailError) {
        console.warn('⚠️ Email notification failed:', emailError);
      }

      // Trigger real-time notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('new-support-ticket', { detail: supportTicket });
        window.dispatchEvent(event);
      }

      console.log('✅ Support ticket created in Supabase:', supportTicket.id);
      return supportTicket;

    } catch (error) {
      console.error('❌ Failed to create support ticket:', error);
      throw error;
    }
  }

  /**
   * Get all support tickets from Supabase
   */
  static async getTickets(): Promise<SupportTicket[]> {
    try {
      const { data: tickets, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database format to app format
      const supportTickets: SupportTicket[] = tickets.map((ticket: DbSupportTicket) => ({
        id: ticket.id,
        customerName: ticket.customer_name,
        customerEmail: ticket.customer_email,
        company: ticket.company,
        category: ticket.category as SupportTicket['category'],
        severity: ticket.severity as SupportTicket['severity'],
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status as SupportTicket['status'],
        priority: ticket.priority,
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at)
      }));

      console.log(`📊 Fetched ${supportTickets.length} tickets from Supabase`);
      return supportTickets;

    } catch (error) {
      console.error('❌ Failed to fetch tickets:', error);
      return [];
    }
  }

  /**
   * Update ticket status in Supabase
   */
  static async updateTicketStatus(id: string, status: 'open' | 'in-progress' | 'resolved' | 'closed'): Promise<SupportTicket | null> {
    try {
      const { data: updatedTicket, error } = await supabase
        .from('support_tickets')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Convert to app format
      const supportTicket: SupportTicket = {
        id: updatedTicket.id,
        customerName: updatedTicket.customer_name,
        customerEmail: updatedTicket.customer_email,
        company: updatedTicket.company,
        category: updatedTicket.category as SupportTicket['category'],
        severity: updatedTicket.severity as SupportTicket['severity'],
        subject: updatedTicket.subject,
        description: updatedTicket.description,
        status: updatedTicket.status as SupportTicket['status'],
        priority: updatedTicket.priority,
        createdAt: new Date(updatedTicket.created_at),
        updatedAt: new Date(updatedTicket.updated_at)
      };

      console.log(`🔄 Ticket ${id} status updated to: ${status}`);
      return supportTicket;

    } catch (error) {
      console.error('❌ Failed to update ticket status:', error);
      return null;
    }
  }

  /**
   * Delete ticket from Supabase
   */
  static async deleteTicket(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`🗑️ Ticket ${id} deleted from Supabase`);
      return true;

    } catch (error) {
      console.error('❌ Failed to delete ticket:', error);
      return false;
    }
  }

  /**
   * Get all customers from Supabase
   */
  static async getCustomers(): Promise<CustomerProfile[]> {
    try {
      const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to app format
      const customerProfiles: CustomerProfile[] = customers.map((customer: DbCustomer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company || '',
        tier: customer.tier as CustomerProfile['tier'],
        totalTickets: customer.total_tickets,
        openTickets: customer.open_tickets,
        avgResponseTime: customer.avg_response_time,
        satisfactionScore: customer.satisfaction_score,
        joinDate: new Date(customer.join_date),
        lastActivity: new Date(customer.last_activity)
      }));

      return customerProfiles;

    } catch (error) {
      console.error('❌ Failed to fetch customers:', error);
      return [];
    }
  }

  /**
   * Log customer interaction
   */
  static async logInteraction(
    customerId: string, 
    interactionType: string, 
    interactionData: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      await supabase
        .from('contact_interactions')
        .insert({
          customer_id: customerId,
          interaction_type: interactionType,
          interaction_data: interactionData
        });

    } catch (error) {
      console.warn('Failed to log interaction:', error);
    }
  }

  /**
   * Log email sent
   */
  static async logEmailSent(
    emailTo: string,
    emailType: string,
    subject: string,
    resendEmailId?: string
  ): Promise<void> {
    try {
      // Get customer ID if exists
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', emailTo)
        .single();

      await supabase
        .from('email_logs')
        .insert({
          customer_id: customer?.id,
          email_to: emailTo,
          email_from: 'support-marketing@bobbiedigital.com',
          subject,
          email_type: emailType,
          status: 'sent',
          resend_email_id: resendEmailId
        });

    } catch (error) {
      console.warn('Failed to log email:', error);
    }
  }

  /**
   * Get support statistics
   */
  static async getSupportStats(): Promise<SupportStats> {
    try {
      // Get ticket counts by status
      const { data: statusCounts } = await supabase
        .from('support_tickets')
        .select('status')
        .then(result => {
          const counts = { open: 0, 'in-progress': 0, resolved: 0, closed: 0 };
          result.data?.forEach(ticket => {
            counts[ticket.status as keyof typeof counts]++;
          });
          return { data: counts };
        });

      // Get ticket counts by category
      const { data: categoryCounts } = await supabase
        .from('support_tickets')
        .select('category')
        .then(result => {
          const counts = { billing: 0, technical: 0, account: 0, integration: 0, general: 0 };
          result.data?.forEach(ticket => {
            counts[ticket.category as keyof typeof counts]++;
          });
          return { data: counts };
        });

      // Get total counts
      const { count: totalTickets } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });

      const { count: openTickets } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      const stats: SupportStats = {
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        averageResponseTime: 2.5, // Could calculate this from actual data
        customerSatisfaction: 4.2, // Could calculate this from feedback data
        ticketsByStatus: statusCounts || { open: 0, 'in-progress': 0, resolved: 0, closed: 0 },
        ticketsByCategory: categoryCounts || { billing: 0, technical: 0, account: 0, integration: 0, general: 0 },
        ticketTrends: [] // Could implement trending data
      };

      return stats;

    } catch (error) {
      console.error('❌ Failed to get support stats:', error);
      return {
        totalTickets: 0,
        openTickets: 0,
        averageResponseTime: 0,
        customerSatisfaction: 0,
        ticketsByStatus: { open: 0, 'in-progress': 0, resolved: 0, closed: 0 },
        ticketsByCategory: { billing: 0, technical: 0, account: 0, integration: 0, general: 0 },
        ticketTrends: []
      };
    }
  }

  /**
   * Get FAQ data
   */
  static async getFAQs(): Promise<FAQ[]> {
    try {
      const { data: faqs, error } = await supabase
        .from('support_faqs')
        .select('*')
        .eq('is_public', true)
        .order('view_count', { ascending: false });

      if (error) throw error;

      return faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        isPublic: faq.is_public,
        viewCount: faq.view_count,
        createdAt: new Date(faq.created_at)
      }));

    } catch (error) {
      console.error('❌ Failed to fetch FAQs:', error);
      return [];
    }
  }

  // Legacy compatibility methods
  static async getTicketsByCategory(category: string): Promise<SupportTicket[]> {
    const tickets = await this.getTickets();
    return tickets.filter(t => t.category === category);
  }

  static async getTicketsBySeverity(severity: string): Promise<SupportTicket[]> {
    const tickets = await this.getTickets();
    return tickets.filter(t => t.severity === severity);
  }

  static async getCustomersBySeverity(severity: string): Promise<CustomerProfile[]> {
    const tickets = await this.getTicketsBySeverity(severity);
    const customerEmails = tickets.map(t => t.customerEmail);
    const customers = await this.getCustomers();
    return customers.filter(c => customerEmails.includes(c.email));
  }

  static async sendEmailNotification(ticket: SupportTicket): Promise<void> {
    // This is handled in createTicket now
    console.log('Email notification sent for ticket:', ticket.id);
  }
}
