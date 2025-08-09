import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Globe
} from 'lucide-react';

// Simple customer questions for supply chain setup
interface QuestionStep {
  id: number;
  question: string;
  type: 'choice' | 'text';
  choices?: string[];
  icon: React.ReactNode;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface CustomerInfo {
  businessType: string;
  shipFrom: string;
  shipTo: string;
  products: string;
  volume: string;
  currentChallenges: string;
}

const setupQuestions: QuestionStep[] = [
  {
    id: 1,
    question: "Hi! 👋 What kind of business do you have?",
    type: 'choice',
    choices: ['Online Store', 'Manufacturer', 'Wholesaler', 'Retailer', 'Other'],
    icon: <Package className="h-4 w-4" />
  },
  {
    id: 2,
    question: "Where do you ship FROM most of the time? (Like what city or country)",
    type: 'text',
    icon: <MapPin className="h-4 w-4" />
  },
  {
    id: 3,
    question: "Where do you ship TO? Pick your main area:",
    type: 'choice',
    choices: ['Same Country', 'International', 'North America', 'Europe', 'Asia', 'Everywhere'],
    icon: <Truck className="h-4 w-4" />
  },
  {
    id: 4,
    question: "What do you sell? (Just tell me in simple words)",
    type: 'text',
    icon: <Package className="h-4 w-4" />
  },
  {
    id: 5,
    question: "How many packages do you ship per month?",
    type: 'choice',
    choices: ['1-50', '51-200', '201-1000', '1000+', 'Not sure'],
    icon: <Truck className="h-4 w-4" />
  },
  {
    id: 6,
    question: "What's your biggest shipping headache right now?",
    type: 'choice',
    choices: ['Costs too much', 'Takes too long', 'Things get lost', 'Customs problems', 'Hard to track', 'All of the above!'],
    icon: <Heart className="h-4 w-4" />
  }
];

const AISetupChat: React.FC = () => {
  // ...existing code...
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    businessType: '',
    shipFrom: '',
    shipTo: '',
    products: '',
    volume: '',
    currentChallenges: ''
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with a super friendly welcome
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: "Hello! 😊 I'm your Ship_fix helper! I'll ask you a few super easy questions so I can set up the perfect shipping system for your business. Ready?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Start first question after a short delay
    setTimeout(() => {
      askNextQuestion();
    }, 1500);
  }, [askNextQuestion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const askNextQuestion = useCallback(() => {
    if (currentStep < setupQuestions.length) {
      const question = setupQuestions[currentStep];
      const questionMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: question.question,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, questionMessage]);
    } else {
      completeSetup();
    }
  }, [currentStep, completeSetup]);

  const handleAnswer = (answer: string) => {
    // Add user's answer to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: answer,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Save the answer
    const questionId = setupQuestions[currentStep].id;
    const updatedInfo = { ...customerInfo };
    
    switch (questionId) {
      case 1: updatedInfo.businessType = answer; break;
      case 2: updatedInfo.shipFrom = answer; break;
      case 3: updatedInfo.shipTo = answer; break;
      case 4: updatedInfo.products = answer; break;
      case 5: updatedInfo.volume = answer; break;
      case 6: updatedInfo.currentChallenges = answer; break;
    }
    setCustomerInfo(updatedInfo);

    // Move to next question
    setCurrentStep(prev => prev + 1);
    
    // Ask next question after a brief delay
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  const completeSetup = useCallback(() => {
    setIsLoading(true);
    
    // Show completion message
    const completionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: "🎉 Perfect! I'm setting up your custom shipping system now...",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, completionMessage]);

    // Simulate AI setup process
    setTimeout(() => {
      const setupMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `✨ All done! I've set up Ship_fix for your ${customerInfo.businessType.toLowerCase()} business. Your system is now optimized for shipping ${customerInfo.products} from ${customerInfo.shipFrom} to ${customerInfo.shipTo}. I've also added special features to help with "${customerInfo.currentChallenges.toLowerCase()}". You're ready to start saving money and time! 🚀`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, setupMessage]);
      setIsComplete(true);
      setIsLoading(false);
    }, 3000);
  }, [customerInfo.businessType, customerInfo.products, customerInfo.shipFrom, customerInfo.shipTo, customerInfo.currentChallenges]);

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setCustomerInfo({
      businessType: '',
      shipFrom: '',
      shipTo: '',
      products: '',
      volume: '',
      currentChallenges: ''
    });
    setIsComplete(false);
    setIsLoading(false);
    
    // Restart with welcome message
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: "Hello! 😊 I'm your Ship_fix helper! I'll ask you a few super easy questions so I can set up the perfect shipping system for your business. Ready?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setTimeout(() => askNextQuestion(), 1500);
    }, 500);
  };
// ...existing code...

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await aiAssistant.askQuestion(inputValue);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        timestamp: new Date(),
        aiResponse
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I encountered an error. Please try asking your question again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  // ...existing code...

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Ship_fix AI Assistant
        </h1>
        <p className="text-gray-600">
          Get help with setup, troubleshooting, and learning about Ship_fix features
        </p>
      </div>

      {/* Setup Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Setup Progress</span>
            <Button 
              onClick={runDiagnostics} 
              disabled={isDiagnosticsRunning}
              size="sm"
              variant="outline"
            >
              {isDiagnosticsRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run Diagnostics
            </Button>
          </CardTitle>
          <CardDescription>
            {setupProgress.completed} of {setupProgress.total} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={setupProgress.percentage} className="mb-4" />
          
          {setupSteps.length > 0 && (
            <div className="space-y-2">
              {setupSteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(step.status)}
                    <div>
                      <span className="font-medium">{step.title}</span>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' ? (
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          ) : (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            
                            {message.aiResponse && (
                              <div className="mt-3 space-y-2">
                                {message.aiResponse.suggestions && (
                                  <div>
                                    <p className="text-xs font-medium mb-1">Suggestions:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {message.aiResponse.suggestions.map((suggestion, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {suggestion}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {message.aiResponse.codeExample && (
                                  <div className="bg-gray-800 text-gray-100 p-2 rounded text-xs font-mono">
                                    <pre>{message.aiResponse.codeExample}</pre>
                                  </div>
                                )}
                                
                                {message.aiResponse.documentationLink && (
                                  <Button size="sm" variant="outline" className="text-xs">
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    View Documentation
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Ship_fix setup..."
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Help */}
        <div className="space-y-6">
          
          {/* Quick Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
              <CardDescription>Common questions and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "How do I set up the database?",
                  "What environment variables do I need?",
                  "How do I start the development server?",
                  "How do I deploy to production?",
                  "How do I configure email notifications?",
                  "What are the MCP AI features?"
                ].map((question, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => {
                      if (!isLoading) {
                        setInputValue("");
                        handleSendMessageDirect(question);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <span className="text-xs">{question}</span>
                  </Button>
                ))}
  // ...existing code...
// Add direct send for quick help
// ...existing code...

              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  API Reference
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Supabase Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AISetupChat;
