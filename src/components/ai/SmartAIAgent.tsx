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
  const [setupStep, setSetupStep] = useState(-1); // -1 means not in setup flow
  const [setupAnswers, setSetupAnswers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // AI Agent introduction
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your Ship_fix AI Assistant! I can help you:\n\n🚀 Set up your shipping platform\n💡 Answer questions about features\n💳 Help with billing and upgrades\n⚙️ Customize your settings\n🎨 Build your brand identity\n📞 Provide support\n\nWhat would you like to do today?",
      timestamp: new Date(),
      actionButtons: [
        { text: "🚀 Set Up My Platform", action: "setup" },
        { text: "🎨 Have Your Own Brand Info? Just Need a Little Help? Click Here", action: "brand_fasttrack", variant: 'premium' },
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
    // Setup flow: answer button logic
    if (setupStep >= 0 && action.startsWith('setup_answer_')) {
      // Parse step and answer from action string
      const parts = action.split('_');
      const step = parseInt(parts[2], 10);
      const answer = parts.slice(3).join('_');
      handleSetupAnswer(step, answer);
      return;
    }
    // Prevent other action buttons during setup flow
    if (setupStep >= 0) return;
    switch (action) {
      case 'setup':
        setSetupStep(0);
        setSetupAnswers([]);
        askSetupQuestion(0);
        break;
      case 'brand_fasttrack':
        addAIMessage("🎨 **Perfect! Let's get your brand dialed in!**\n\nI see you already have some brand ideas. Let's capture what you know and I'll help fill in any gaps with targeted questions.\n\n📝 **Fill out what you know:**\n• Brand Name\n• Mission Statement\n• Brand Colors\n• Logo Concept\n• Tagline\n• Market Niche\n• Target Audience\n\n✨ **Aura will analyze** what you provide and ask smart follow-up questions for anything missing!", [
          { text: "📝 Start Brand Form", action: "brand_form" },
          { text: "💬 Chat About My Brand", action: "brand_chat" },
          { text: "📊 Get Brand Analysis", action: "brand_analysis" }
        ]);
        break;
      case 'brand_form':
        addAIMessage("📝 **Brand Information Form**\n\nLet's collect your brand details step by step. I'll ask you about each component:\n\n1️⃣ **Brand Name**: What would you like to call your brand?");
        break;
      case 'brand_chat':
        addAIMessage("💬 **Tell me about your brand!**\n\nI'd love to learn about your business. Share whatever you know about:\n• Your brand name ideas\n• What your business does\n• Who your customers are\n• Your brand personality\n• Colors/style preferences\n\nI'll help you develop a complete brand identity!");
        break;
      case 'brand_analysis':
        addAIMessage("📊 **Brand Analysis Mode**\n\nI'll analyze your current brand elements for consistency and market appeal. Share what you have so far and I'll provide:\n\n✨ **Real-time feedback**\n🎯 **Target audience alignment**\n🎨 **Visual consistency**\n📈 **Market positioning**\n💡 **Improvement suggestions**");
        break;
      case 'brand_workshop':
        addAIMessage("🎨 **Complete Brand Workshop**\n\nLet's build your brand step-by-step! I'll guide you through each component:\n\n**Phase 1: Foundation**\n1️⃣ Brand Name & Core Message\n2️⃣ Mission & Values\n3️⃣ Target Audience Definition\n\n**Phase 2: Identity**\n4️⃣ Visual Identity (Colors, Logo)\n5️⃣ Voice & Personality\n6️⃣ Market Positioning\n\nReady to start with your brand foundation?", [
          { text: "🚀 Start Phase 1", action: "brand_foundation" },
          { text: "🎨 Jump to Visual Identity", action: "brand_visual" },
          { text: "📝 Complete Brand Brief", action: "brand_brief" }
        ]);
        break;
      case 'brand_suggestions':
        addAIMessage("💡 **Personalized Brand Suggestions**\n\nBased on our conversation, here are my recommendations:\n\n🎯 **For EcoFlow (Sustainable Tech):**\n• **Colors**: Forest green (#2D5016), Ocean blue (#1E40AF), Clean white (#FFFFFF)\n• **Tagline Ideas**: \"Technology that flows with nature\" | \"Green innovation, endless possibilities\"\n• **Logo Concept**: Stylized leaf with circuit patterns or water flow with tech elements\n• **Mission Focus**: Highlight specific environmental impact (energy savings, waste reduction)\n\nWant me to develop any of these further?", [
          { text: "🎨 Design Logo Concepts", action: "logo_design" },
          { text: "✏️ Refine Taglines", action: "tagline_workshop" },
          { text: "🌱 Environmental Messaging", action: "eco_messaging" }
        ]);
        break;
      case 'eco_brand':
        addAIMessage("🌿 **Sustainable Brand Story Development**\n\nFor EcoFlow, let's create an authentic sustainability narrative:\n\n📖 **Brand Story Framework:**\n• **Problem**: Traditional tech's environmental impact\n• **Solution**: Your eco-friendly alternatives\n• **Impact**: Measurable environmental benefits\n• **Future**: Vision for sustainable tech\n\n🎯 **Key Messages:**\n• Quantify environmental benefits (% energy reduction, materials saved)\n• Highlight sustainable manufacturing processes\n• Showcase long-term durability vs. disposable tech\n\nWhat specific environmental benefits does EcoFlow provide?");
        break;
      case 'millennial_brand':
        addAIMessage("👥 **Millennial-Focused Brand Strategy**\n\nFor EcoFlow targeting millennials:\n\n🎯 **Brand Positioning:**\n• **Authentic Purpose**: Real environmental impact, not greenwashing\n• **Transparency**: Open about processes, sourcing, impact\n• **Community**: Build eco-conscious tech community\n• **Experience**: Seamless online experience, social sharing\n\n📱 **Channel Strategy:**\n• Instagram: Behind-the-scenes sustainability content\n• TikTok: Quick eco-tech tips and impact stories\n• LinkedIn: Professional sustainability thought leadership\n\nWhich aspect would you like to develop first?", [
          { text: "📱 Social Media Strategy", action: "social_strategy" },
          { text: "🤝 Community Building", action: "community_plan" },
          { text: "💚 Purpose Messaging", action: "purpose_messaging" }
        ]);
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
  // Setup questions for onboarding
  const setupQuestions = [
    {
      question: "What type of business do you have?",
      choices: ["Online Store", "Manufacturer", "Wholesaler", "Retailer", "Other"],
    },
    {
      question: "Where do you ship FROM most of the time? (City or country)",
      choices: null,
    },
    {
      question: "Where do you ship TO?",
      choices: ["Same Country", "International", "North America", "Europe", "Asia", "Everywhere"],
    },
    {
      question: "What do you sell? (Just a few words)",
      choices: null,
    },
    {
      question: "How many packages do you ship per month?",
      choices: ["1-50", "51-200", "201-1000", "1000+", "Not sure"],
    },
    {
      question: "What's your biggest shipping headache right now?",
      choices: ["Costs too much", "Takes too long", "Things get lost", "Customs problems", "Hard to track", "All of the above!"],
    },
  ];

  // Handle setup answer
  const handleSetupAnswer = (step: number, answer: string) => {
    setSetupAnswers(prev => {
      const updated = [...prev];
      updated[step] = answer;
      return updated;
    });
    addUserMessage(answer);
    setTimeout(() => {
      setSetupStep(step + 1);
      askSetupQuestion(step + 1);
    }, 600);
  };

  // Ask a setup question
  const askSetupQuestion = (step: number) => {
    if (step < setupQuestions.length) {
      const q = setupQuestions[step];
      addAIMessage(q.question, q.choices ? q.choices.map(c => ({ text: c, action: `setup_answer_${step}_${c}` })) : undefined);
    } else {
      finishSetup();
    }
  };

  // Finish setup
  const finishSetup = () => {
    addAIMessage("🎉 All done! Your Ship_fix platform is set up for your needs. You can now start shipping and optimizing! 🚀");
    setSetupStep(-1);
  };
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
    
    // Enhanced brand-specific responses
    if (input.includes('brand') || input.includes('logo') || input.includes('color') || input.includes('mission') || input.includes('tagline')) {
      response = "🎨 **Brand Development Analysis:**\n\nI can see you're working on brand elements! Let me help you develop a cohesive brand identity.\n\n✨ **From what you shared, I can help with:**\n• Brand name optimization\n• Mission statement clarity\n• Color psychology and selection\n• Logo concept development\n• Tagline creation\n• Target audience alignment\n\n🧠 **Aura Analysis**: I'll provide real-time feedback on consistency and market appeal as we develop each component.";
      actionButtons = [
        { text: "🎨 Complete Brand Workshop", action: "brand_workshop" },
        { text: "📊 Analyze Current Brand", action: "brand_analysis" },
        { text: "💡 Get Brand Suggestions", action: "brand_suggestions" }
      ];
    } else if (input.includes('sustainable') || input.includes('eco') || input.includes('green')) {
      response = "🌱 **Sustainability Brand Focus:**\n\nExcellent! Sustainability is a powerful brand differentiator. For eco-focused brands, I recommend:\n\n🎯 **Brand Elements:**\n• **Colors**: Earth tones, greens, blues for trust & nature\n• **Mission**: Clear environmental impact statement\n• **Audience**: Eco-conscious consumers value authenticity\n• **Messaging**: Focus on real environmental benefits\n\n✨ Let's develop your sustainable brand story!";
      actionButtons = [
        { text: "🌿 Develop Eco Brand Story", action: "eco_brand" },
        { text: "🎨 Sustainable Color Palette", action: "eco_colors" },
        { text: "📝 Environmental Mission", action: "eco_mission" }
      ];
    } else if (input.includes('millennial') || input.includes('young') || input.includes('generation')) {
      response = "👥 **Millennial Target Audience Analysis:**\n\nGreat target audience choice! Millennials respond well to:\n\n🎯 **Brand Characteristics:**\n• **Authenticity**: Real stories, not just marketing\n• **Purpose**: Brands that make a difference\n• **Experience**: Seamless digital interactions\n• **Community**: Social responsibility and connection\n• **Visual**: Clean, modern, mobile-first design\n\n💡 Let's align your brand with millennial values!";
      actionButtons = [
        { text: "👥 Millennial Brand Strategy", action: "millennial_brand" },
        { text: "📱 Digital-First Approach", action: "digital_brand" },
        { text: "🤝 Community Building", action: "community_brand" }
      ];
    } else if (input.includes('price') || input.includes('cost') || input.includes('billing')) {
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
    if (setupStep >= 0) {
      // Setup flow: treat input as answer
      handleSetupAnswer(setupStep, inputValue.trim());
      setInputValue('');
      return;
    }
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
    <Card className="flex flex-col w-full max-w-xl mx-auto shadow-lg rounded-xl overflow-hidden" style={{ height: '100%', maxHeight: '90vh', minHeight: '350px', background: '#fff' }}>
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
        <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ minHeight: 0, maxHeight: '60vh' }}>
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
                      {/* Setup flow: show answer buttons only for current question */}
                      {setupStep >= 0 && message.actionButtons && messages[messages.length - 1].id === message.id && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actionButtons.map((button, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              variant={button.variant === 'premium' ? 'default' : 'outline'}
                              className={button.variant === 'premium' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                              onClick={() => {
                                // Only allow answer for current setup step
                                if (setupStep >= 0) handleSetupAnswer(setupStep, button.text);
                              }}
                            >
                              {button.text}
                            </Button>
                          ))}
                        </div>
                      )}
                      {/* Non-setup flow: show action buttons as before */}
                      {setupStep === -1 && message.actionButtons && (
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
        </div>
        
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
