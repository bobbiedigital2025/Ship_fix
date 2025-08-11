import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Sparkles, 
  User, 
  Send, 
  CheckCircle, 
  RotateCcw,
  Palette,
  Target,
  Heart,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { BrandPreview } from './BrandPreview';

interface ChatMessage {
  id: string;
  type: 'user' | 'aura';
  content: string;
  timestamp: Date;
  actionButtons?: ActionButton[];
}

interface ActionButton {
  text: string;
  action: string;
  variant?: 'default' | 'outline' | 'premium';
}

interface BrandData {
  brandName: string;
  mission: string;
  colorPalette: string[];
  logoStyle: string;
  tagline: string;
  niche: string;
  targetAudience: string;
  emotions: string;
  personality: string;
}

const DISCOVERY_QUESTIONS = [
  {
    id: 'emotions',
    question: "What emotions do you want your brand to inspire in people? Think about how you want customers to feel when they see your brand.",
    field: 'emotions',
    followUp: "Tell me more about the emotional connection you want to create."
  },
  {
    id: 'customers',
    question: "What kind of customers do you imagine connecting with your brand? Describe your ideal customer.",
    field: 'targetAudience',
    followUp: "Can you paint a picture of who they are and what they value?"
  },
  {
    id: 'personality',
    question: "If your brand were a person, how would it dress or speak? What would its personality be like?",
    field: 'personality',
    followUp: "Help me understand the human side of your brand."
  },
  {
    id: 'purpose',
    question: "What problem does your brand solve, and why does that matter to you?",
    field: 'mission',
    followUp: "What drives your passion for this?"
  },
  {
    id: 'differentiation',
    question: "What makes your brand different from everyone else in your space?",
    field: 'niche',
    followUp: "What's your unique angle or approach?"
  }
];

const AuraBrandDiscovery: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [brandData, setBrandData] = useState<BrandData>({
    brandName: '',
    mission: '',
    colorPalette: [],
    logoStyle: '',
    tagline: '',
    niche: '',
    targetAudience: '',
    emotions: '',
    personality: ''
  });
  const [discoveryComplete, setDiscoveryComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aura introduction
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'aura',
      content: "✨ Hi! I'm Aura, your brand discovery assistant. I'm here to help you create a powerful, authentic brand identity that resonates with your audience.\n\nI'll guide you through a conversation to discover your:\n🎯 Brand purpose & mission\n💝 Emotional connection\n🎨 Visual identity\n📢 Voice & personality\n👥 Target audience\n\nReady to discover your brand's unique story? Let's start with something fundamental...",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Start with first question after a brief pause
    setTimeout(() => {
      askNextQuestion();
    }, 2000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const askNextQuestion = () => {
    if (currentQuestionIndex < DISCOVERY_QUESTIONS.length) {
      const question = DISCOVERY_QUESTIONS[currentQuestionIndex];
      addAuraMessage(question.question);
    } else {
      // All questions answered, analyze and create brand
      analyzeBrandData();
    }
  };

  const analyzeBrandData = async () => {
    setIsLoading(true);
    addAuraMessage("✨ Let me analyze your responses and create your brand identity...");
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate brand elements based on responses
    const generatedBrand = generateBrandElements();
    setBrandData(generatedBrand);
    setDiscoveryComplete(true);
    setShowPreview(true);
    setIsLoading(false);
    
    addAuraMessage("🎉 I've crafted your brand identity! Take a look at the preview on the right. This is based on everything you've shared with me.", [
      { text: "✅ I love it! Approve", action: "approve", variant: "premium" },
      { text: "🔄 Let's refine this", action: "try_again", variant: "outline" }
    ]);
  };

  const generateBrandElements = (): BrandData => {
    // This would normally use AI, but for demo purposes, we'll create based on keywords
    const emotions = brandData.emotions.toLowerCase();
    const personality = brandData.personality.toLowerCase();
    const mission = brandData.mission.toLowerCase();
    
    // Generate brand name suggestions
    const brandNames = ["Zenith", "Lumina", "Nexus", "Aria", "Prism", "Epoch"];
    const generatedBrandName = brandNames[Math.floor(Math.random() * brandNames.length)];
    
    // Generate color palette based on emotions
    let colors = ['#3B82F6', '#8B5CF6', '#F59E0B']; // default
    if (emotions.includes('calm') || emotions.includes('peace')) {
      colors = ['#10B981', '#3B82F6', '#F3F4F6'];
    } else if (emotions.includes('energy') || emotions.includes('exciting')) {
      colors = ['#EF4444', '#F59E0B', '#8B5CF6'];
    } else if (emotions.includes('luxury') || emotions.includes('premium')) {
      colors = ['#1F2937', '#D97706', '#F9FAFB'];
    } else if (emotions.includes('trust') || emotions.includes('reliable')) {
      colors = ['#1E40AF', '#6B7280', '#F3F4F6'];
    }
    
    // Generate mission statement
    const generatedMission = `To ${mission.includes('help') ? 'empower' : 'inspire'} ${brandData.targetAudience} through ${brandData.niche} that ${emotions.includes('joy') ? 'brings joy and' : emotions.includes('trust') ? 'builds trust and' : 'creates value and'} meaningful impact.`;
    
    // Generate logo style
    const logoStyles = ['Modern minimalist', 'Bold and geometric', 'Organic and flowing', 'Classic and timeless', 'Playful and creative'];
    const logoStyle = logoStyles[Math.floor(Math.random() * logoStyles.length)];
    
    // Generate tagline
    const taglines = [
      `Where ${emotions.split(' ')[0]} meets innovation`,
      `${personality.split(' ')[0]} solutions for modern life`,
      `Bringing ${emotions.split(' ')[0]} to every experience`,
      `Your partner in ${brandData.niche.toLowerCase()}`,
      `Elevating ${brandData.niche.toLowerCase()} with purpose`
    ];
    const tagline = taglines[Math.floor(Math.random() * taglines.length)];
    
    return {
      ...brandData,
      brandName: generatedBrandName,
      mission: generatedMission,
      colorPalette: colors,
      logoStyle: logoStyle,
      tagline: tagline
    };
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'approve':
        handleApproval();
        break;
      case 'try_again':
        handleTryAgain();
        break;
      default:
        break;
    }
  };

  const handleApproval = () => {
    setShowPreview(false);
    addAuraMessage("🎉 Wonderful! Your brand identity has been locked in. You now have a complete brand foundation to build upon.\n\n✨ Your brand journey is just beginning. Use these elements consistently across all your touchpoints to create a strong, memorable brand presence.\n\nCongratulations on discovering your brand's unique story!");
    
    // Reset for new session
    setTimeout(() => {
      resetDiscovery();
    }, 5000);
  };

  const handleTryAgain = () => {
    addAuraMessage("Let's refine your brand! What specific aspects would you like to adjust? I can ask you clarifying questions to better understand your vision.", [
      { text: "🎨 Different colors", action: "refine_colors" },
      { text: "📝 Different messaging", action: "refine_messaging" },
      { text: "🎯 Different audience", action: "refine_audience" },
      { text: "💫 Everything feels off", action: "restart" }
    ]);
  };

  const resetDiscovery = () => {
    setMessages([]);
    setCurrentQuestionIndex(0);
    setBrandData({
      brandName: '',
      mission: '',
      colorPalette: [],
      logoStyle: '',
      tagline: '',
      niche: '',
      targetAudience: '',
      emotions: '',
      personality: ''
    });
    setDiscoveryComplete(false);
    setShowPreview(false);
    
    // Start fresh
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'aura',
      content: "✨ Ready for another brand discovery journey? Let's create something amazing together!",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  const addAuraMessage = (content: string, actionButtons?: ActionButton[]) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'aura',
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

  const handleResponse = async (userInput: string) => {
    if (!userInput.trim() || discoveryComplete) return;
    
    // Store the response in brand data
    if (currentQuestionIndex < DISCOVERY_QUESTIONS.length) {
      const currentQuestion = DISCOVERY_QUESTIONS[currentQuestionIndex];
      setBrandData(prev => ({
        ...prev,
        [currentQuestion.field]: userInput
      }));
    }
    
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Ask follow-up or next question
    if (currentQuestionIndex < DISCOVERY_QUESTIONS.length) {
      const currentQuestion = DISCOVERY_QUESTIONS[currentQuestionIndex];
      
      // Sometimes ask a follow-up
      if (Math.random() > 0.6 && currentQuestion.followUp) {
        addAuraMessage(currentQuestion.followUp);
        setIsLoading(false);
        return;
      }
      
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      if (currentQuestionIndex + 1 < DISCOVERY_QUESTIONS.length) {
        const nextQuestion = DISCOVERY_QUESTIONS[currentQuestionIndex + 1];
        addAuraMessage(`Perfect! That gives me great insight. Now, ${nextQuestion.question}`);
      } else {
        addAuraMessage("Excellent! I have everything I need. Let me create your brand identity...");
        setTimeout(() => {
          analyzeBrandData();
        }, 1000);
      }
    }
    
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    addUserMessage(inputValue);
    const userInput = inputValue;
    setInputValue('');
    await handleResponse(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Chat Interface */}
      <div className="flex-1">
        <Card className="flex flex-col h-full shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <span>Aura - Brand Discovery</span>
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">AI Powered</Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-purple-100">
              Your personal brand strategist & creative partner
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-100'
                    } rounded-lg p-4`}>
                      <div className="flex items-start space-x-3">
                        {message.type === 'aura' ? (
                          <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0 text-purple-600" />
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
                                  className={button.variant === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}
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
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Input Area */}
            <div className="border-t pt-4 mt-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts and vision..."
                  disabled={isLoading || discoveryComplete}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputValue.trim() || discoveryComplete}
                  size="icon"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Preview Panel */}
      {showPreview && (
        <div className="w-96">
          <BrandPreview 
            brandData={brandData} 
            onApprove={() => handleActionButton('approve')}
            onTryAgain={() => handleActionButton('try_again')}
          />
        </div>
      )}
    </div>
  );
};

export default AuraBrandDiscovery;