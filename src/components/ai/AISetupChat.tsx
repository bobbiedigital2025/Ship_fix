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
  XCircle, 
  Clock, 
  Play,
  RefreshCw,
  BookOpen,
  Code,
  ExternalLink
} from 'lucide-react';
import { aiAssistant, type AIResponse, type SetupStep } from '../../lib/ai-setup-assistant';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  aiResponse?: AIResponse;
}

const AISetupChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([]);
  const [setupProgress, setSetupProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: "👋 Hello! I'm your Ship_fix AI assistant. I can help you set up the application, troubleshoot issues, and answer questions about features.",
      timestamp: new Date(),
      aiResponse: {
        message: "I'm here to help you get Ship_fix running smoothly!",
        suggestions: [
          "Run system diagnostics",
          "Ask about database setup",
          "Get help with environment configuration",
          "Learn about support features",
          "Deploy to production"
        ]
      }
    };
    setMessages([welcomeMessage]);
    loadSetupProgress();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSetupProgress = async () => {
    try {
      const progress = await aiAssistant.getSetupProgress();
      setSetupProgress(progress);
    } catch (error) {
      console.error('Failed to load setup progress:', error);
    }
  };

  const runDiagnostics = async () => {
    setIsDiagnosticsRunning(true);
    try {
      const steps = await aiAssistant.runDiagnostics();
      setSetupSteps(steps);
      await loadSetupProgress();
      
      const diagnosticMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `🔍 Diagnostics complete! I've checked ${steps.length} setup steps.`,
        timestamp: new Date(),
        aiResponse: {
          message: "Here's what I found:",
          suggestions: steps
            .filter(step => step.status === 'error')
            .map(step => `Fix: ${step.title}`)
        }
      };
      setMessages(prev => [...prev, diagnosticMessage]);
    } catch (error) {
      console.error('Diagnostics failed:', error);
    } finally {
      setIsDiagnosticsRunning(false);
    }
  };

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
                    onClick={() => setInputValue(question)}
                  >
                    <span className="text-xs">{question}</span>
                  </Button>
                ))}
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
