/**
 * MCP Inky & Supa Brain Integration Service
 * Connects the support system with AI-powered assistance
 */

import { supabase } from './supabase';
import { SupportTicket } from '@/types/support';

interface MCPInkyResponse {
  success: boolean;
  data?: Record<string, unknown>;
  suggestions?: string[];
  autoResponse?: string;
  confidence?: number;
  error?: string;
}

interface SupaBrainAnalysis {
  ticketAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    suggestedResponse: string;
    relatedFAQs: string[];
    confidence: number;
  };
  customerInsights: {
    previousTickets: number;
    satisfactionScore: number;
    preferredResponseTime: string;
    communicationStyle: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
  recommendations: {
    priorityLevel: number;
    escalationNeeded: boolean;
    suggestedAssignee?: string;
    estimatedResolutionTime: string;
    recommendedActions: string[];
  };
}

export class MCPInkySupaBrainService {
  private static readonly MCP_ENDPOINT = import.meta.env.VITE_MCP_ENDPOINT || 'https://api.mcpinky.com';
  private static readonly MCP_ENABLED = import.meta.env.VITE_MCP_ENABLED === 'true';

  /**
   * Analyze a support ticket using Supa Brain AI
   */
  static async analyzeTicket(ticket: SupportTicket): Promise<SupaBrainAnalysis | null> {
    if (!this.MCP_ENABLED) {
      console.log('🧠 MCP Inky/Supa Brain is disabled');
      return null;
    }

    try {
      console.log('🧠 Analyzing ticket with Supa Brain:', ticket.id);

      // Get customer history for context
      const customerContext = await this.getCustomerContext(ticket.customerEmail);

      // Prepare analysis request
      const analysisRequest = {
        ticket: {
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          severity: ticket.severity,
          customerEmail: ticket.customerEmail,
          customerName: ticket.customerName,
          company: ticket.company
        },
        customerContext,
        requestedAnalysis: [
          'sentiment_analysis',
          'urgency_detection',
          'category_validation',
          'response_generation',
          'faq_matching',
          'customer_insights',
          'recommendations'
        ]
      };

      const response = await fetch(`${this.MCP_ENDPOINT}/supa-brain/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MCP_API_KEY || ''}`,
        },
        body: JSON.stringify(analysisRequest)
      });

      if (!response.ok) {
        console.error('🚨 Supa Brain analysis failed:', response.statusText);
        return this.getFallbackAnalysis(ticket);
      }

      const analysisResult = await response.json();
      
      // Log the analysis for debugging
      await this.logMCPInteraction('supa_brain_analysis', ticket.id, analysisResult);

      return this.formatSupaBrainResponse(analysisResult);

    } catch (error) {
      console.error('🚨 Supa Brain analysis error:', error);
      return this.getFallbackAnalysis(ticket);
    }
  }

  /**
   * Generate an AI-powered response suggestion using MCP Inky
   */
  static async generateResponseSuggestion(
    ticket: SupportTicket, 
    conversationHistory: string[] = []
  ): Promise<MCPInkyResponse> {
    if (!this.MCP_ENABLED) {
      return {
        success: false,
        error: 'MCP Inky is disabled'
      };
    }

    try {
      console.log('🤖 Generating response with MCP Inky for ticket:', ticket.id);

      // Get relevant FAQs and customer context
      const [faqs, customerContext] = await Promise.all([
        this.getRelevantFAQs(ticket.subject + ' ' + ticket.description),
        this.getCustomerContext(ticket.customerEmail)
      ]);

      const requestPayload = {
        ticket: {
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          severity: ticket.severity,
          status: ticket.status
        },
        customer: {
          name: ticket.customerName,
          email: ticket.customerEmail,
          company: ticket.company,
          context: customerContext
        },
        conversationHistory,
        availableFAQs: faqs,
        responseType: 'support_response',
        tone: this.getResponseTone(ticket.severity, customerContext?.tier),
        guidelines: [
          'Be empathetic and professional',
          'Provide clear steps when applicable',
          'Reference relevant documentation',
          'Ask clarifying questions if needed',
          'Offer additional help'
        ]
      };

      const response = await fetch(`${this.MCP_ENDPOINT}/inky/generate-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MCP_API_KEY || ''}`,
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        console.error('🚨 MCP Inky response generation failed:', response.statusText);
        return {
          success: false,
          error: 'Failed to generate AI response'
        };
      }

      const result = await response.json();

      // Log the interaction
      await this.logMCPInteraction('inky_response_generation', ticket.id, result);

      return {
        success: true,
        autoResponse: result.suggestedResponse,
        suggestions: result.alternativeResponses || [],
        confidence: result.confidence || 0.8
      };

    } catch (error) {
      console.error('🚨 MCP Inky error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Smart ticket categorization using AI
   */
  static async categorizeTicket(subject: string, description: string): Promise<{
    category: string;
    severity: string;
    confidence: number;
    reasoning: string;
  }> {
    if (!this.MCP_ENABLED) {
      return this.getFallbackCategorization(subject, description);
    }

    try {
      const response = await fetch(`${this.MCP_ENDPOINT}/supa-brain/categorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MCP_API_KEY || ''}`,
        },
        body: JSON.stringify({
          subject,
          description,
          availableCategories: ['billing', 'technical', 'account', 'integration', 'general'],
          availableSeverities: ['low', 'medium', 'high', 'critical']
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          category: result.category || 'general',
          severity: result.severity || 'medium',
          confidence: result.confidence || 0.7,
          reasoning: result.reasoning || 'AI analysis based on content'
        };
      }
    } catch (error) {
      console.error('🚨 AI categorization error:', error);
    }

    return this.getFallbackCategorization(subject, description);
  }

  /**
   * Get customer context from database
   */
  private static async getCustomerContext(customerEmail: string) {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select(`
          *,
          support_tickets(count),
          contact_interactions(count)
        `)
        .eq('email', customerEmail)
        .single();

      return customer;
    } catch (error) {
      console.error('Error fetching customer context:', error);
      return null;
    }
  }

  /**
   * Get relevant FAQs based on content similarity
   */
  private static async getRelevantFAQs(content: string, limit: number = 5) {
    try {
      // This would ideally use vector similarity search in Supabase
      // For now, we'll do a simple text search
      const { data: faqs } = await supabase
        .from('support_faqs')
        .select('question, answer, category')
        .eq('is_public', true)
        .textSearch('question', content)
        .limit(limit);

      return faqs || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }

  /**
   * Log MCP interactions for analysis and debugging
   */
  private static async logMCPInteraction(
    interactionType: string, 
    ticketId: string, 
    data: Record<string, unknown>
  ) {
    try {
      await supabase
        .from('contact_interactions')
        .insert({
          customer_id: null, // We could link this to customer if available
          interaction_type: `mcp_${interactionType}`,
          interaction_data: {
            ticketId,
            timestamp: new Date().toISOString(),
            data
          }
        });
    } catch (error) {
      console.error('Error logging MCP interaction:', error);
    }
  }

  /**
   * Determine appropriate response tone based on context
   */
  private static getResponseTone(severity: string, customerTier?: string): string {
    if (severity === 'critical') return 'urgent_professional';
    if (customerTier === 'enterprise') return 'formal_detailed';
    if (severity === 'high') return 'concerned_helpful';
    return 'friendly_professional';
  }

  /**
   * Format Supa Brain analysis response
   */
  private static formatSupaBrainResponse(rawResponse: Record<string, unknown>): SupaBrainAnalysis {
    return {
      ticketAnalysis: {
        sentiment: rawResponse.sentiment || 'neutral',
        urgency: rawResponse.urgency || 'medium',
        category: rawResponse.category || 'general',
        suggestedResponse: rawResponse.suggestedResponse || '',
        relatedFAQs: rawResponse.relatedFAQs || [],
        confidence: rawResponse.confidence || 0.7
      },
      customerInsights: {
        previousTickets: rawResponse.customerInsights?.previousTickets || 0,
        satisfactionScore: rawResponse.customerInsights?.satisfactionScore || 0,
        preferredResponseTime: rawResponse.customerInsights?.preferredResponseTime || '24 hours',
        communicationStyle: rawResponse.customerInsights?.communicationStyle || 'standard',
        riskLevel: rawResponse.customerInsights?.riskLevel || 'low'
      },
      recommendations: {
        priorityLevel: rawResponse.recommendations?.priorityLevel || 3,
        escalationNeeded: rawResponse.recommendations?.escalationNeeded || false,
        suggestedAssignee: rawResponse.recommendations?.suggestedAssignee,
        estimatedResolutionTime: rawResponse.recommendations?.estimatedResolutionTime || '2-3 business days',
        recommendedActions: rawResponse.recommendations?.recommendedActions || []
      }
    };
  }

  /**
   * Fallback analysis when AI is unavailable
   */
  private static getFallbackAnalysis(ticket: SupportTicket): SupaBrainAnalysis {
    const urgencyMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical'
    };

    return {
      ticketAnalysis: {
        sentiment: 'neutral',
        urgency: urgencyMap[ticket.severity] || 'medium',
        category: ticket.category,
        suggestedResponse: 'Thank you for contacting us. We have received your request and will respond shortly.',
        relatedFAQs: [],
        confidence: 0.5
      },
      customerInsights: {
        previousTickets: 0,
        satisfactionScore: 0,
        preferredResponseTime: '24 hours',
        communicationStyle: 'standard',
        riskLevel: 'low'
      },
      recommendations: {
        priorityLevel: 3,
        escalationNeeded: false,
        estimatedResolutionTime: '1-2 business days',
        recommendedActions: ['Send acknowledgment', 'Gather more information']
      }
    };
  }

  /**
   * Fallback categorization when AI is unavailable
   */
  private static getFallbackCategorization(subject: string, description: string) {
    const content = (subject + ' ' + description).toLowerCase();
    
    let category = 'general';
    let severity = 'medium';

    // Simple keyword-based categorization
    if (content.includes('billing') || content.includes('payment') || content.includes('invoice')) {
      category = 'billing';
    } else if (content.includes('api') || content.includes('integration') || content.includes('code')) {
      category = 'integration';
    } else if (content.includes('login') || content.includes('password') || content.includes('account')) {
      category = 'account';
    } else if (content.includes('bug') || content.includes('error') || content.includes('not working')) {
      category = 'technical';
    }

    // Simple severity detection
    if (content.includes('urgent') || content.includes('critical') || content.includes('down')) {
      severity = 'high';
    } else if (content.includes('question') || content.includes('how to')) {
      severity = 'low';
    }

    return {
      category,
      severity,
      confidence: 0.6,
      reasoning: 'Keyword-based fallback categorization'
    };
  }
}

export default MCPInkySupaBrainService;
