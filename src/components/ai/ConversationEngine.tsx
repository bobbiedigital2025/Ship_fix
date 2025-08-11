import { useState, useCallback } from 'react';

export type ConversationMode = 'discovery' | 'fill-in-blanks';
export type ConversationStatus = 'active' | 'awaiting-approval' | 'approved' | 'needs-refinement';
export type EmotionType = 'positive' | 'neutral' | 'negative' | 'excited' | 'confused' | 'frustrated';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actionButtons?: ActionButton[];
  emotion?: EmotionType;
  mode?: ConversationMode;
  iterationId?: string;
}

export interface ActionButton {
  text: string;
  action: string;
  variant?: 'default' | 'outline' | 'premium';
}

export interface BrandInfo {
  name: string;
  tagline: string;
  industry: string;
  targetAudience: string;
  values: string[];
  personality: string[];
  colors: string[];
  completionPercentage: number;
  status: 'draft' | 'in-progress' | 'ready-for-review' | 'approved';
}

export interface ConversationIteration {
  id: string;
  timestamp: Date;
  messages: ChatMessage[];
  brandInfo: BrandInfo;
  mode: ConversationMode;
  status: ConversationStatus;
}

export interface ConversationContext {
  sessionId: string;
  currentIteration: ConversationIteration;
  previousIterations: ConversationIteration[];
  mode: ConversationMode;
  status: ConversationStatus;
  totalIterations: number;
}

class ConversationEngine {
  private context: ConversationContext;
  private onContextUpdate: (context: ConversationContext) => void;

  constructor(onContextUpdate: (context: ConversationContext) => void) {
    this.onContextUpdate = onContextUpdate;
    this.context = this.initializeContext();
  }

  private initializeContext(): ConversationContext {
    const sessionId = `session_${Date.now()}`;
    const initialBrandInfo: BrandInfo = {
      name: '',
      tagline: '',
      industry: '',
      targetAudience: '',
      values: [],
      personality: [],
      colors: [],
      completionPercentage: 0,
      status: 'draft'
    };

    const initialIteration: ConversationIteration = {
      id: `iteration_${Date.now()}`,
      timestamp: new Date(),
      messages: [],
      brandInfo: initialBrandInfo,
      mode: 'discovery',
      status: 'active'
    };

    return {
      sessionId,
      currentIteration: initialIteration,
      previousIterations: [],
      mode: 'discovery',
      status: 'active',
      totalIterations: 1
    };
  }

  // Sentiment/Emotion Detection
  private detectEmotion(message: string): EmotionType {
    const lowerMessage = message.toLowerCase();
    
    // Positive indicators
    const positiveKeywords = ['great', 'awesome', 'perfect', 'love', 'excellent', 'amazing', 'fantastic', 'wonderful'];
    const excitementKeywords = ['excited', 'can\'t wait', 'thrilled', '!', 'wow'];
    
    // Negative indicators
    const negativeKeywords = ['hate', 'terrible', 'awful', 'bad', 'worst', 'horrible'];
    const frustrationKeywords = ['frustrated', 'annoying', 'difficult', 'confusing', 'stuck'];
    const confusionKeywords = ['confused', 'don\'t understand', 'what', 'how', 'unclear', '?'];

    if (excitementKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'excited';
    }
    if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'positive';
    }
    if (frustrationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'frustrated';
    }
    if (confusionKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'confused';
    }
    if (negativeKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'negative';
    }

    return 'neutral';
  }

  // Mode-specific question generation
  private generateDiscoveryQuestions(): string[] {
    const brandCompletionPercentage = this.context.currentIteration.brandInfo.completionPercentage;
    
    if (brandCompletionPercentage < 20) {
      return [
        "Let's start with the basics - what would you like to call your brand?",
        "What industry or market are you in?",
        "Who is your ideal customer or target audience?"
      ];
    } else if (brandCompletionPercentage < 50) {
      return [
        "What makes your brand different from competitors?",
        "What core values does your brand represent?",
        "How would you describe your brand's personality in 3 words?"
      ];
    } else if (brandCompletionPercentage < 80) {
      return [
        "What colors do you associate with your brand?",
        "What's your brand's mission or purpose?",
        "How do you want customers to feel when they interact with your brand?"
      ];
    } else {
      return [
        "Let's refine the details - does this tagline capture your brand essence?",
        "Are these brand colors aligned with your vision?",
        "Does this brand personality match how you want to be perceived?"
      ];
    }
  }

  private generateFillInBlanksQuestions(missingInfo: string[]): string[] {
    const questions: string[] = [];
    
    missingInfo.forEach(info => {
      switch (info) {
        case 'name':
          questions.push("I notice we haven't set your brand name yet. What would you like to call your brand?");
          break;
        case 'tagline':
          questions.push("A tagline would help capture your brand essence. What message do you want to convey?");
          break;
        case 'industry':
          questions.push("To better understand your market, which industry are you in?");
          break;
        case 'targetAudience':
          questions.push("Who is your primary target audience or ideal customer?");
          break;
        case 'values':
          questions.push("What core values are important to your brand?");
          break;
        case 'personality':
          questions.push("How would you describe your brand's personality?");
          break;
        case 'colors':
          questions.push("What colors represent your brand best?");
          break;
      }
    });

    return questions;
  }

  // Brand info extraction from conversation
  private extractBrandInfo(message: string): Partial<BrandInfo> {
    const brandInfo: Partial<BrandInfo> = {};
    const lowerMessage = message.toLowerCase();

    // Extract brand name patterns
    const namePatterns = [
      /(?:brand name|called|name it|company name).*?(?:is|will be|should be)\s+([a-zA-Z\s]+)/i,
      /(?:my brand is|it's called|we're called)\s+([a-zA-Z\s]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        brandInfo.name = match[1].trim();
        break;
      }
    }

    // Extract industry
    const industries = ['technology', 'healthcare', 'finance', 'retail', 'education', 'manufacturing', 'services', 'food', 'fashion', 'automotive'];
    const foundIndustry = industries.find(industry => lowerMessage.includes(industry));
    if (foundIndustry) {
      brandInfo.industry = foundIndustry;
    }

    // Extract values
    const valueKeywords = ['quality', 'innovation', 'trust', 'reliability', 'customer service', 'sustainability', 'transparency', 'excellence'];
    const foundValues = valueKeywords.filter(value => lowerMessage.includes(value));
    if (foundValues.length > 0) {
      brandInfo.values = foundValues;
    }

    // Extract personality traits
    const personalityTraits = ['professional', 'friendly', 'innovative', 'trustworthy', 'modern', 'traditional', 'bold', 'conservative'];
    const foundTraits = personalityTraits.filter(trait => lowerMessage.includes(trait));
    if (foundTraits.length > 0) {
      brandInfo.personality = foundTraits;
    }

    // Extract colors
    const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'black', 'white', 'gray', 'pink'];
    const foundColors = colors.filter(color => lowerMessage.includes(color));
    if (foundColors.length > 0) {
      brandInfo.colors = foundColors.map(color => {
        // Convert color names to hex values
        const colorMap: { [key: string]: string } = {
          'blue': '#3B82F6',
          'red': '#EF4444',
          'green': '#10B981',
          'yellow': '#F59E0B',
          'purple': '#8B5CF6',
          'orange': '#F97316',
          'black': '#1F2937',
          'white': '#FFFFFF',
          'gray': '#6B7280',
          'pink': '#EC4899'
        };
        return colorMap[color] || color;
      });
    }

    return brandInfo;
  }

  // Calculate completion percentage
  private calculateCompletionPercentage(brandInfo: BrandInfo): number {
    const fields = [
      brandInfo.name,
      brandInfo.tagline,
      brandInfo.industry,
      brandInfo.targetAudience,
      brandInfo.values.length > 0,
      brandInfo.personality.length > 0,
      brandInfo.colors.length > 0
    ];

    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }

  // Update brand info and recalculate completion
  private updateBrandInfo(updates: Partial<BrandInfo>): BrandInfo {
    const updatedBrandInfo = { ...this.context.currentIteration.brandInfo, ...updates };
    updatedBrandInfo.completionPercentage = this.calculateCompletionPercentage(updatedBrandInfo);
    
    // Update status based on completion
    if (updatedBrandInfo.completionPercentage >= 90) {
      updatedBrandInfo.status = 'ready-for-review';
    } else if (updatedBrandInfo.completionPercentage >= 50) {
      updatedBrandInfo.status = 'in-progress';
    } else {
      updatedBrandInfo.status = 'draft';
    }

    return updatedBrandInfo;
  }

  // Get missing information for fill-in-blanks mode
  private getMissingInfo(): string[] {
    const brandInfo = this.context.currentIteration.brandInfo;
    const missing: string[] = [];

    if (!brandInfo.name) missing.push('name');
    if (!brandInfo.tagline) missing.push('tagline');
    if (!brandInfo.industry) missing.push('industry');
    if (!brandInfo.targetAudience) missing.push('targetAudience');
    if (brandInfo.values.length === 0) missing.push('values');
    if (brandInfo.personality.length === 0) missing.push('personality');
    if (brandInfo.colors.length === 0) missing.push('colors');

    return missing;
  }

  // Process user message and generate AI response
  public async processMessage(userMessage: string): Promise<{
    aiMessage: ChatMessage;
    updatedBrandInfo: BrandInfo;
  }> {
    // Detect emotion
    const emotion = this.detectEmotion(userMessage);

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
      emotion,
      mode: this.context.mode,
      iterationId: this.context.currentIteration.id
    };

    // Add user message to current iteration
    this.context.currentIteration.messages.push(userMsg);

    // Extract brand information from user message
    const extractedBrandInfo = this.extractBrandInfo(userMessage);
    const updatedBrandInfo = this.updateBrandInfo(extractedBrandInfo);

    // Generate AI response based on current mode
    let aiContent: string;
    let actionButtons: ActionButton[] = [];

    if (this.context.mode === 'discovery') {
      const discoveryQuestions = this.generateDiscoveryQuestions();
      aiContent = this.generateDiscoveryResponse(userMessage, emotion, discoveryQuestions);
      actionButtons = this.generateDiscoveryActions();
    } else {
      const missingInfo = this.getMissingInfo();
      const fillInQuestions = this.generateFillInBlanksQuestions(missingInfo);
      aiContent = this.generateFillInBlanksResponse(userMessage, emotion, fillInQuestions);
      actionButtons = this.generateFillInBlanksActions(missingInfo);
    }

    // Check if ready for approval
    if (updatedBrandInfo.completionPercentage >= 85) {
      actionButtons.push(
        { text: "✅ Approve This Version", action: "approve_iteration", variant: "premium" },
        { text: "🔄 Refine Further", action: "continue_refinement", variant: "outline" }
      );
    }

    // Create AI message
    const aiMessage: ChatMessage = {
      id: `msg_${Date.now()}_ai`,
      type: 'ai',
      content: aiContent,
      timestamp: new Date(),
      actionButtons,
      mode: this.context.mode,
      iterationId: this.context.currentIteration.id
    };

    // Add AI message to current iteration
    this.context.currentIteration.messages.push(aiMessage);

    // Update brand info in current iteration
    this.context.currentIteration.brandInfo = updatedBrandInfo;

    // Trigger context update
    this.onContextUpdate(this.context);

    return { aiMessage, updatedBrandInfo };
  }

  private generateDiscoveryResponse(userMessage: string, emotion: EmotionType, questions: string[]): string {
    let response = "";

    // Respond to emotion
    switch (emotion) {
      case 'excited':
        response += "I love your enthusiasm! 🎉 ";
        break;
      case 'frustrated':
        response += "I understand this can be challenging. Let me help make this easier. ";
        break;
      case 'confused':
        response += "No worries, let me clarify things for you. ";
        break;
      case 'positive':
        response += "Great to hear! ";
        break;
    }

    // Add discovery content
    response += "Let's continue building your brand identity. ";
    
    if (questions.length > 0) {
      response += questions[0];
    }

    return response;
  }

  private generateFillInBlanksResponse(userMessage: string, emotion: EmotionType, questions: string[]): string {
    let response = "";

    // Respond to emotion
    switch (emotion) {
      case 'excited':
        response += "Excellent! ";
        break;
      case 'frustrated':
        response += "Let's tackle this step by step. ";
        break;
    }

    if (questions.length > 0) {
      response += questions[0];
    } else {
      response += "Great! We have all the essential information. Would you like to review and refine your brand?";
    }

    return response;
  }

  private generateDiscoveryActions(): ActionButton[] {
    return [
      { text: "🎯 Switch to Fill-in-Blanks", action: "switch_to_fillblanks", variant: "outline" },
      { text: "💡 Get Suggestions", action: "get_suggestions", variant: "outline" }
    ];
  }

  private generateFillInBlanksActions(missingInfo: string[]): ActionButton[] {
    const actions: ActionButton[] = [];
    
    if (missingInfo.length > 0) {
      actions.push(
        { text: "🔄 Switch to Discovery", action: "switch_to_discovery", variant: "outline" },
        { text: "⏭️ Skip This Field", action: "skip_field", variant: "outline" }
      );
    }

    return actions;
  }

  // Save current iteration and start new one
  public createNewIteration(): void {
    // Save current iteration to history
    this.context.previousIterations.push({
      ...this.context.currentIteration,
      status: 'approved'
    });

    // Create new iteration
    const newIteration: ConversationIteration = {
      id: `iteration_${Date.now()}`,
      timestamp: new Date(),
      messages: [],
      brandInfo: { ...this.context.currentIteration.brandInfo },
      mode: this.context.mode,
      status: 'active'
    };

    this.context.currentIteration = newIteration;
    this.context.totalIterations += 1;
    this.onContextUpdate(this.context);
  }

  // Revert to previous iteration
  public revertToPreviousIteration(iterationId: string): boolean {
    const iteration = this.context.previousIterations.find(iter => iter.id === iterationId);
    if (iteration) {
      // Move current iteration to history
      this.context.previousIterations.push(this.context.currentIteration);
      
      // Restore previous iteration
      this.context.currentIteration = {
        ...iteration,
        id: `iteration_${Date.now()}`,
        timestamp: new Date(),
        status: 'active'
      };

      this.onContextUpdate(this.context);
      return true;
    }
    return false;
  }

  // Switch conversation mode
  public switchMode(newMode: ConversationMode): void {
    this.context.mode = newMode;
    this.context.currentIteration.mode = newMode;
    this.onContextUpdate(this.context);
  }

  // Approve current iteration
  public approveIteration(): void {
    this.context.currentIteration.status = 'approved';
    this.context.status = 'approved';
    this.context.currentIteration.brandInfo.status = 'approved';
    this.onContextUpdate(this.context);
  }

  // Get current context
  public getContext(): ConversationContext {
    return this.context;
  }
}

export const useConversationEngine = () => {
  const [context, setContext] = useState<ConversationContext | null>(null);

  const createEngine = useCallback(() => {
    return new ConversationEngine(setContext);
  }, []);

  return {
    createEngine,
    context
  };
};

export default ConversationEngine;