import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import BrandPreviewPanel from './BrandPreviewPanel';
import ConversationEngine, { 
  useConversationEngine, 
  ChatMessage, 
  BrandInfo, 
  ConversationMode,
  ConversationIteration 
} from './ConversationEngine';
import { 
  Bot, 
  User, 
  Send, 
  RotateCcw,
  Zap,
  Target,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Settings
} from 'lucide-react';

interface ChatInterfaceProps {
  onBrandUpdate?: (brandInfo: BrandInfo) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBrandUpdate }) => {
  const { createEngine, context } = useConversationEngine();
  const [engine, setEngine] = useState<ConversationEngine | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    name: '',
    tagline: '',
    industry: '',
    targetAudience: '',
    values: [],
    personality: [],
    colors: [],
    completionPercentage: 0,
    status: 'draft'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation engine
  useEffect(() => {
    const newEngine = createEngine();
    setEngine(newEngine);
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      content: "👋 Welcome to your Brand Discovery Session!\n\nI'm here to help you build and refine your brand identity. We can work in two ways:\n\n🔍 **Discovery Mode**: I'll ask probing questions to explore your brand deeply\n📝 **Fill-in-the-Blanks**: We'll focus on completing any missing brand information\n\nWhich approach would you prefer to start with?",
      timestamp: new Date(),
      actionButtons: [
        { text: "🔍 Start Discovery Mode", action: "start_discovery" },
        { text: "📝 Fill Missing Info", action: "start_fillblanks" },
        { text: "💡 Tell Me More", action: "explain_modes" }
      ]
    };
    
    setMessages([welcomeMessage]);
  }, [createEngine]);

  // Update when context changes
  useEffect(() => {
    if (context) {
      setBrandInfo(context.currentIteration.brandInfo);
      onBrandUpdate?.(context.currentIteration.brandInfo);
    }
  }, [context, onBrandUpdate]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleActionButton = async (action: string) => {
    if (!engine) return;

    switch (action) {
      case 'start_discovery':
        engine.switchMode('discovery');
        addAIMessage("🔍 **Discovery Mode Activated!**\n\nI'll ask thoughtful questions to deeply understand your brand. This is perfect for exploring new ideas and uncovering insights you might not have considered.\n\nLet's start with the foundation - what inspired you to create this brand?");
        break;
        
      case 'start_fillblanks':
        engine.switchMode('fill-in-blanks');
        addAIMessage("📝 **Fill-in-the-Blanks Mode Activated!**\n\nI'll identify what's missing from your brand profile and ask targeted questions to complete it efficiently.\n\nLet's begin - what's your brand name?");
        break;
        
      case 'explain_modes':
        addAIMessage("💡 **Understanding the Two Modes:**\n\n🔍 **Discovery Mode:**\n• Deep exploration through probing questions\n• Uncovers insights and new perspectives\n• Great for brainstorming and ideation\n• Takes more time but reveals hidden opportunities\n\n📝 **Fill-in-the-Blanks Mode:**\n• Focused on completing missing information\n• Quick and efficient\n• Perfect when you know what you want\n• Gets you to completion faster\n\nBoth modes save your progress and let you switch anytime. Which sounds better for your current needs?", [
          { text: "🔍 Discovery Mode", action: "start_discovery" },
          { text: "📝 Fill-in-the-Blanks", action: "start_fillblanks" }
        ]);
        break;
        
      case 'switch_to_discovery':
        engine.switchMode('discovery');
        addAIMessage("🔍 **Switched to Discovery Mode!**\n\nLet's explore your brand more deeply. Tell me about what makes your brand unique compared to others in your space.");
        break;
        
      case 'switch_to_fillblanks':
        engine.switchMode('fill-in-blanks');
        addAIMessage("📝 **Switched to Fill-in-the-Blanks Mode!**\n\nLet me identify what we still need to complete your brand profile...");
        break;
        
      case 'approve_iteration':
        engine.approveIteration();
        addAIMessage("✅ **Iteration Approved!**\n\nExcellent! Your brand definition has been saved. You can continue refining or start a new iteration if you want to explore different directions.", [
          { text: "🚀 Start New Iteration", action: "new_iteration", variant: "premium" },
          { text: "🔄 Continue Refining", action: "continue_refinement" },
          { text: "📊 View All Iterations", action: "show_iterations" }
        ]);
        break;
        
      case 'new_iteration':
        engine.createNewIteration();
        addAIMessage("🚀 **New Iteration Started!**\n\nYour previous version has been saved. We can now explore new directions or refine different aspects of your brand. What would you like to focus on in this iteration?");
        break;
        
      case 'continue_refinement':
        addAIMessage("🔄 **Continuing Refinement...**\n\nLet's polish your brand further. What aspect would you like to refine - your brand name, values, personality, or something else?");
        break;
        
      case 'show_iterations':
        if (context) {
          const iterationInfo = `📊 **Your Brand Iterations:**\n\nCurrent: Iteration ${context.totalIterations} (${context.currentIteration.status})\nPrevious: ${context.previousIterations.length} saved versions\nCompletion: ${brandInfo.completionPercentage}%\n\nYou can revert to any previous iteration anytime.`;
          addAIMessage(iterationInfo, [
            { text: "⏪ Revert to Previous", action: "revert_iteration" },
            { text: "🔄 Continue Current", action: "continue_refinement" }
          ]);
        }
        break;
        
      default:
        break;
    }
  };

  const addAIMessage = (content: string, actionButtons?: any[]) => {
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !engine) return;
    
    setIsLoading(true);
    
    // Add user message immediately
    addUserMessage(inputValue);
    const userInput = inputValue;
    setInputValue('');
    
    try {
      // Process through conversation engine
      const { aiMessage, updatedBrandInfo } = await engine.processMessage(userInput);
      
      // Update state
      setBrandInfo(updatedBrandInfo);
      setMessages(prev => [...prev, aiMessage]);
      onBrandUpdate?.(updatedBrandInfo);
      
    } catch (error) {
      console.error('Error processing message:', error);
      addAIMessage("I apologize, but I encountered an error processing your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeIcon = (mode: ConversationMode) => {
    return mode === 'discovery' ? <Lightbulb className="h-4 w-4" /> : <Target className="h-4 w-4" />;
  };

  const getModeColor = (mode: ConversationMode) => {
    return mode === 'discovery' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600';
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'excited': return 'text-green-600';
      case 'positive': return 'text-blue-600';
      case 'frustrated': return 'text-red-600';
      case 'confused': return 'text-yellow-600';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-full space-x-6">
      {/* Chat Window - Left Side */}
      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 flex flex-col shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span>Brand Discovery Chat</span>
                {context && (
                  <Badge className={`flex items-center space-x-1 ${getModeColor(context.mode)}`}>
                    {getModeIcon(context.mode)}
                    <span>{context.mode === 'discovery' ? 'Discovery' : 'Fill-in-Blanks'}</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {context && (
                  <>
                    <Badge variant="outline" className="text-xs">
                      Iteration {context.totalIterations}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {brandInfo.completionPercentage}% Complete
                    </Badge>
                  </>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              AI-powered brand discovery with context persistence and iterative refinement
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4">
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
                          <User className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getEmotionColor(message.emotion)}`} />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {message.content}
                          </div>
                          
                          {/* Action Buttons */}
                          {message.actionButtons && message.actionButtons.length > 0 && (
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
                          
                          {/* Message Metadata */}
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.emotion && message.emotion !== 'neutral' && (
                              <Badge variant="outline" className={`text-xs ${getEmotionColor(message.emotion)}`}>
                                {message.emotion}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading Indicator */}
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
            
            <Separator className="my-4" />
            
            {/* Input Area */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Share your thoughts about your brand... (${context?.mode || 'chat'} mode)`}
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
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleActionButton(context?.mode === 'discovery' ? 'switch_to_fillblanks' : 'switch_to_discovery')}
                  className="text-xs"
                >
                  {context?.mode === 'discovery' ? '📝 Switch to Fill-in-Blanks' : '🔍 Switch to Discovery'}
                </Button>
                {context && context.previousIterations.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleActionButton('show_iterations')}
                    className="text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Iterations ({context.previousIterations.length + 1})
                  </Button>
                )}
                {brandInfo.completionPercentage >= 85 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleActionButton('approve_iteration')}
                    className="text-xs text-green-600 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready for Approval
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Brand Preview Panel - Right Side */}
      <div className="w-80 flex-shrink-0">
        <BrandPreviewPanel 
          brandInfo={brandInfo} 
          isLive={true}
        />
      </div>
    </div>
  );
};

export default ChatInterface;