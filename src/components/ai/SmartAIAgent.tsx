import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bot, 
  User, 
  Send, 
  CheckCircle, 
  Truck, 
  Package, 
  MapPin,
  Heart,
  DollarSign,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Crown,
  Settings,
  CreditCard,
  BarChart3,
  Headphones
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actionButtons?: ActionButton[];
}

interface ActionButton {
  text: string;
  action: string;
  variant?: 'default' | 'outline' | 'premium';
}

interface CustomerData {
  setupComplete: boolean;
  subscription: 'free' | 'pro' | 'enterprise';
  monthlyShipments: number;
  businessType: string;
  currentPlan: string;
}

// Ship_fix Knowledge Base for AI Agent
const SHIPFIX_KNOWLEDGE = {
  features: {
    free: ['Basic shipping tracking', 'Up to 50 shipments/month', 'Email notifications', 'Simple dashboard'],
    pro: ['Advanced analytics', 'Up to 1000 shipments/month', 'AI route optimization', 'Tariff monitoring', 'Priority support', 'Custom alerts'],
    enterprise: ['Unlimited shipments', 'Full AI automation', 'Custom integrations', 'Dedicated account manager', 'White-label options', 'SLA guarantee']
  },
  pricing: {
    free: '$0/month',
    pro: '$49/month', 
    enterprise: '$299/month'
  },
  upsells: {
    free_to_pro: 'Upgrade to Pro for AI-powered route optimization and save up to 30% on shipping costs!',
    pro_to_enterprise: 'Scale to Enterprise for unlimited automation and dedicated support!'
  }
};

const SmartAIAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    setupComplete: false,
    subscription: 'free',
    monthlyShipments: 0,
    businessType: '',
    currentPlan: 'Free Plan'
  });
  const [setupStep, setSetupStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // AI Agent introduction
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your Ship_fix AI Assistant! I can help you:\n\n🚀 Set up your shipping platform\n💡 Answer questions about features\n💳 Help with billing and upgrades\n⚙️ Customize your settings\n📞 Provide support\n\nWhat would you like to do today?",
      timestamp: new Date(),
      actionButtons: [
        { text: "🚀 Set Up My Platform", action: "setup" },
        { text: "💡 Learn About Features", action: "features" },
        { text: "💳 View Pricing & Upgrades", action: "pricing" },
        { text: "❓ Ask a Question", action: "question" }
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'setup':
        startSetupFlow();
        break;
      case 'features':
        showFeatures();
        break;
      case 'pricing':
        showPricing();
        break;
      case 'upgrade_pro':
        handleUpgrade('pro');
        break;
      case 'upgrade_enterprise':
        handleUpgrade('enterprise');
        break;
      case 'question':
        addAIMessage("Great! What would you like to know? I can help with:\n\n• How features work\n• Setup and configuration\n• Billing questions\n• Technical support\n• Best practices\n\nJust type your question below! 😊");
        break;
      default:
        break;
    }
  };

  const startSetupFlow = () => {
    addAIMessage("Perfect! Let's get your shipping platform set up. I'll ask you a few super simple questions:\n\n🏢 **Step 1:** What type of business do you have?", [
      { text: "🛒 Online Store", action: "business_ecommerce" },
      { text: "🏭 Manufacturer", action: "business_manufacturer" },
      { text: "📦 Wholesaler", action: "business_wholesaler" },
      { text: "🏪 Retailer", action: "business_retailer" },
      { text: "🔧 Other", action: "business_other" }
    ]);
  };

  const showFeatures = () => {
    const currentFeatures = SHIPFIX_KNOWLEDGE.features[customerData.subscription];
    const nextTier = customerData.subscription === 'free' ? 'pro' : 'enterprise';
    const nextFeatures = SHIPFIX_KNOWLEDGE.features[nextTier];

    addAIMessage(`**Your Current Plan (${customerData.currentPlan}):**\n${currentFeatures.map(f => `✅ ${f}`).join('\n')}\n\n**Available in ${nextTier.toUpperCase()}:**\n${nextFeatures.map(f => `⭐ ${f}`).join('\n')}`, [
      { text: `🚀 Upgrade to ${nextTier.toUpperCase()}`, action: `upgrade_${nextTier}`, variant: 'premium' },
      { text: "📞 Talk to Sales", action: "contact_sales" },
      { text: "📚 Learn More", action: "learn_more" }
    ]);
  };

  const showPricing = () => {
    addAIMessage(`**💰 Ship_fix Pricing Plans:**\n\n**🆓 FREE PLAN - ${SHIPFIX_KNOWLEDGE.pricing.free}**\n${SHIPFIX_KNOWLEDGE.features.free.map(f => `• ${f}`).join('\n')}\n\n**⭐ PRO PLAN - ${SHIPFIX_KNOWLEDGE.pricing.pro}**\n${SHIPFIX_KNOWLEDGE.features.pro.map(f => `• ${f}`).join('\n')}\n\n**👑 ENTERPRISE - ${SHIPFIX_KNOWLEDGE.pricing.enterprise}**\n${SHIPFIX_KNOWLEDGE.features.enterprise.map(f => `• ${f}`).join('\n')}\n\n**💡 Pro Tip:** Most customers save 30%+ on shipping costs with Pro!`, [
      { text: "🚀 Try Pro FREE for 14 days", action: "upgrade_pro", variant: 'premium' },
      { text: "👑 Get Enterprise Demo", action: "upgrade_enterprise", variant: 'premium' },
      { text: "💬 Chat with Sales", action: "contact_sales" }
    ]);
  };

  const handleUpgrade = (plan: string) => {
    if (plan === 'pro') {
      addAIMessage(`🎉 **Excellent choice!** Pro Plan includes:\n\n✨ AI route optimization (save 30% on costs)\n📊 Advanced analytics dashboard\n🚨 Real-time tariff alerts\n📞 Priority support\n🔄 Up to 1000 shipments/month\n\n**Special Offer: 14-day FREE trial!**\n\nShould I activate your Pro trial now?`, [
        { text: "✅ Yes, Start My Trial!", action: "activate_pro_trial", variant: 'premium' },
        { text: "📞 Talk to Sales First", action: "contact_sales" },
        { text: "📋 See Full Feature List", action: "features" }
      ]);
    } else {
      addAIMessage(`👑 **Enterprise is perfect for scaling!** You'll get:\n\n🚀 Unlimited shipments\n🤖 Full AI automation\n🔗 Custom integrations\n👨‍💼 Dedicated account manager\n🏷️ White-label options\n📞 24/7 premium support\n\nLet me connect you with our Enterprise team for a custom demo!`, [
        { text: "📅 Schedule Demo", action: "schedule_demo", variant: 'premium' },
        { text: "💬 Chat with Enterprise Sales", action: "enterprise_sales" },
        { text: "📊 Get Custom Quote", action: "custom_quote" }
      ]);
    }
  };

  const addAIMessage = (content: string, actionButtons?: ActionButton[]) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      actionButtons
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleAIResponse = async (userInput: string) => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Smart responses based on keywords
    let response = "";
    let actionButtons: ActionButton[] = [];

    const input = userInput.toLowerCase();
    
    if (input.includes('price') || input.includes('cost') || input.includes('billing')) {
      response = "💰 **Billing & Pricing Info:**\n\nYour current plan: **" + customerData.currentPlan + "**\n\nNeed to upgrade or have billing questions? I can help with:\n• Plan comparisons\n• Upgrade options\n• Invoice questions\n• Payment methods\n\nWhat specifically would you like to know?";
      actionButtons = [
        { text: "💳 View My Billing", action: "view_billing" },
        { text: "🚀 Upgrade Plan", action: "pricing" },
        { text: "📞 Billing Support", action: "billing_support" }
      ];
    } else if (input.includes('setup') || input.includes('configure')) {
      response = "⚙️ **Setup & Configuration:**\n\nI can help you:\n• Complete initial setup\n• Configure shipping routes\n• Set up automation rules\n• Connect your existing systems\n• Customize notifications\n\nWhat would you like to set up?";
      actionButtons = [
        { text: "🚀 Complete Setup", action: "setup" },
        { text: "🔗 Connect Systems", action: "integrations" },
        { text: "⚙️ Customize Settings", action: "settings" }
      ];
    } else if (input.includes('feature') || input.includes('what can')) {
      showFeatures();
      setIsLoading(false);
      return;
    } else if (input.includes('help') || input.includes('support')) {
      response = "🆘 **Support Options:**\n\nI'm here to help! You can:\n• Ask me any questions (I know everything about Ship_fix!)\n• Get technical support\n• Request feature help\n• Schedule a call with our team\n\nWhat do you need help with?";
      actionButtons = [
        { text: "🔧 Technical Support", action: "tech_support" },
        { text: "📞 Schedule Call", action: "schedule_call" },
        { text: "📚 Documentation", action: "docs" }
      ];
    } else {
      response = "I understand you're asking about: \"" + userInput + "\"\n\n🤖 As your Ship_fix AI agent, I can help with everything from setup to advanced features. Could you tell me more specifically what you'd like to know?\n\nPopular topics:\n• Setting up automation\n• Understanding pricing\n• Configuring notifications\n• Connecting your store\n• Optimizing routes";
      actionButtons = [
        { text: "🚀 Setup Help", action: "setup" },
        { text: "💰 Pricing Info", action: "pricing" },
        { text: "⚙️ Configuration", action: "settings" }
      ];
    }

    addAIMessage(response, actionButtons);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const userInput = inputValue;
    setInputValue('');
    
    await handleAIResponse(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-blue-600" />
            <span>Ship_fix AI Assistant</span>
            <Badge variant="secondary" className="ml-2">24/7 Support</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{customerData.currentPlan}</Badge>
            <Crown className="h-4 w-4 text-yellow-500" />
          </div>
        </CardTitle>
        <CardDescription>
          Your AI-powered assistant for setup, support, billing, and upgrades
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 border'
                } rounded-lg p-4`}>
                  <div className="flex items-start space-x-3">
                    {message.type === 'ai' ? (
                      <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
                    ) : (
                      <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {message.content}
                      </div>
                      
                      {message.actionButtons && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actionButtons.map((button, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              variant={button.variant === 'premium' ? 'default' : 'outline'}
                              className={button.variant === 'premium' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                              onClick={() => handleActionButton(button.action)}
                            >
                              {button.text}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 border">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Ship_fix - setup, features, billing, upgrades..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => handleActionButton('pricing')}>
              💰 Pricing
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleActionButton('features')}>
              ⭐ Features
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleActionButton('setup')}>
              🚀 Setup
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleActionButton('question')}>
              ❓ Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartAIAgent;
