import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Building,
  Tag,
  Zap,
  Shield,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SupportService } from '@/lib/support-service';
import LoginForm from '@/components/auth/LoginForm';
import { FAQ } from '@/types/support';

const supportFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  category: z.enum(['billing', 'technical', 'account', 'integration', 'general']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

const SupportCenter: React.FC = () => {
  console.log('SupportCenter component rendered');
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, checkSession } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      severity: 'medium',
      category: 'general',
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      company: user?.company || '',
    },
  });

  const watchedSeverity = watch('severity');
  const watchedCategory = watch('category');

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const faqData = await SupportService.getFAQs();
        setFaqs(faqData);
      } catch (error) {
        console.error('Error loading FAQs:', error);
      }
    };
    loadFAQs();
  }, []);

  // If not authenticated, show login form
  if (!isAuthenticated && !isLoading) {
    return <LoginForm />;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
          <p className="text-lg font-medium">Authenticating with MCP...</p>
          <p className="text-sm text-gray-600">Establishing secure agent-to-agent connection</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      // Verify MCP session is still valid before submitting
      await checkSession();
      
      const ticket = await SupportService.createTicket({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        company: data.company,
        category: data.category,
        severity: data.severity,
        subject: data.subject,
        description: data.description,
        priority: getSeverityPriority(data.severity),
      });
      
      // Send MCP-based notification instead of direct email
      await SupportService.sendEmailNotification(ticket);
      
      setSubmitSuccess(true);
      reset({
        severity: 'medium',
        category: 'general',
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        company: user?.company || '',
        subject: '',
        description: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      if (error instanceof Error && error.message.includes('session')) {
        setAuthError('Your MCP session has expired. Please log in again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityPriority = (severity: string): number => {
    switch (severity) {
      case 'critical': return 10;
      case 'high': return 8;
      case 'medium': return 5;
      case 'low': return 2;
      default: return 5;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'billing': return <Tag className="w-4 h-4" />;
      case 'technical': return <Zap className="w-4 h-4" />;
      case 'account': return <User className="w-4 h-4" />;
      case 'integration': return <Building className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const categoryFAQs = faqs.filter(faq => faq.category === watchedCategory);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* MCP Authentication Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">
                Connected via MCP Agent-to-Agent Authentication
              </p>
              <p className="text-sm text-blue-700">
                Logged in as: {user?.name} ({user?.email}) | Role: {user?.role}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Auth Error Alert */}
      {authError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="text-lg text-gray-600">
          Get help with your supply chain management platform
        </p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your support ticket has been submitted successfully via MCP! You'll receive a confirmation through our secure agent network.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Submit a Support Ticket
                </CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        {...register('customerName')}
                        className={errors.customerName ? 'border-red-500' : ''}
                        disabled={!!user?.name} // Disable if user is authenticated and has a name
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
                      )}
                      {user?.name && (
                        <p className="text-xs text-blue-600 mt-1">Auto-filled from your MCP profile</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register('customerEmail')}
                        className={errors.customerEmail ? 'border-red-500' : ''}
                        disabled={!!user?.email} // Disable if user is authenticated and has an email
                      />
                      {errors.customerEmail && (
                        <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
                      )}
                      {user?.email && (
                        <p className="text-xs text-blue-600 mt-1">Auto-filled from your MCP profile</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      {...register('company')}
                      disabled={!!user?.company} // Disable if user is authenticated and has a company
                    />
                    {user?.company && (
                      <p className="text-xs text-blue-600 mt-1">Auto-filled from your MCP profile</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category *</Label>
                      <Select onValueChange={(value: string) => setValue('category', value as 'billing' | 'technical' | 'account' | 'integration' | 'general')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="billing">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Billing & Payments
                            </div>
                          </SelectItem>
                          <SelectItem value="technical">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Technical Support
                            </div>
                          </SelectItem>
                          <SelectItem value="account">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Account Management
                            </div>
                          </SelectItem>
                          <SelectItem value="integration">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              API & Integration
                            </div>
                          </SelectItem>
                          <SelectItem value="general">
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4" />
                              General Inquiry
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Severity Level *</Label>
                      <Select onValueChange={(value: string) => setValue('severity', value as 'low' | 'medium' | 'high' | 'critical')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Low - General question
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-500" />
                              Medium - Minor issue
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              High - Major issue
                            </div>
                          </SelectItem>
                          <SelectItem value="critical">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              Critical - System down
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      {...register('subject')}
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      {...register('description')}
                      className={errors.description ? 'border-red-500' : ''}
                      placeholder="Please describe your issue in detail..."
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Shield className="w-4 h-4 mr-2 animate-pulse" />
                        Submitting via MCP...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Submit Ticket via MCP
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    All communications are secured via MCP Agent-to-Agent protocol
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">MCP Secure Channel</p>
                      <p className="text-sm text-gray-600">Agent-to-agent encrypted communication</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Fallback Email Support</p>
                      <p className="text-sm text-gray-600">marketing-support@bobbiedigital.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">Available for Enterprise customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Critical</span>
                    </div>
                    <Badge variant="destructive">&lt; 1 hour</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">High</span>
                    </div>
                    <Badge variant="secondary">&lt; 4 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Medium</span>
                    </div>
                    <Badge variant="secondary">&lt; 24 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Low</span>
                    </div>
                    <Badge variant="secondary">&lt; 48 hours</Badge>
                  </div>
                </CardContent>
              </Card>

              {categoryFAQs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(watchedCategory)}
                      Related FAQs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {categoryFAQs.slice(0, 3).map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(faq.category)}
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Explore configuration options and settings
                </p>
                <Button variant="outline" className="w-full" onClick={() => {
                  // Navigate to configuration as a form of documentation
                  navigate('/configuration');
                }}>
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Explore the dashboard and features
                </p>
                <Button variant="outline" className="w-full" onClick={() => {
                  // Navigate to dashboard which shows features
                  navigate('/');
                }}>
                  Watch Tutorials
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Community Forum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Get help and submit support tickets
                </p>
                <Button variant="outline" className="w-full" onClick={() => {
                  // Navigate to the support page itself as a form of community
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportCenter;
