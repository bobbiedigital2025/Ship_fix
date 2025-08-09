import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Shield, Check, Star, Crown } from 'lucide-react';

interface SignupFormProps {
  onShowLogin: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  trial?: boolean;
  stripePrice?: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: '7-Day Free Trial',
    price: 0,
    interval: '7 days',
    trial: true,
    features: [
      'Full access to all features',
      'Up to 100 shipments',
      'Basic AI assistance',
      'Email support',
      'Standard templates'
    ],
    stripePrice: 'price_trial'
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 29,
    interval: 'month',
    popular: true,
    features: [
      'Up to 1,000 shipments/month',
      'Advanced AI automation',
      'Priority email support',
      'Custom templates',
      'Basic analytics',
      'API access'
    ],
    stripePrice: 'price_basic_monthly'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited shipments',
      'Premium AI features',
      '24/7 phone & chat support',
      'Custom integrations',
      'Advanced analytics & reporting',
      'Dedicated account manager',
      'White-label options'
    ],
    stripePrice: 'price_pro_monthly'
  }
];

const SignupForm: React.FC<SignupFormProps> = ({ onShowLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<string>('trial');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // For trial plan, sign up directly
      if (selectedPlan === 'trial') {
        // Create account with trial subscription
        console.log('Creating trial account:', formData);
        
        // Simulate user creation and login (in production, this would be handled by the backend)
        const user = {
          id: `trial-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          role: 'user' as const,
          company: formData.company,
          permissions: ['read', 'write', 'manage_suppliers', 'manage_shippers', 'manage_inventory'],
          subscription: {
            plan: 'trial',
            status: 'active',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          }
        };
        
        // Store user info and mark as authenticated
        localStorage.setItem('mcp_user_info', JSON.stringify(user));
        
        // Refresh the page to trigger auth state update
        window.location.reload();
      } else {
        // Redirect to Stripe checkout for paid plans
        const plan = subscriptionPlans.find(p => p.id === selectedPlan);
        if (plan) {
          await redirectToStripeCheckout(plan, formData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToStripeCheckout = async (plan: SubscriptionPlan, userData: typeof formData) => {
    // Load Stripe
    const stripe = await import('@stripe/stripe-js').then(module => 
      module.loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    );

    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    // Create checkout session (this would typically be done on the backend)
    console.log('Redirecting to Stripe checkout for plan:', plan.name);
    console.log('User data:', userData);

    // For demo purposes, show an alert
    alert(`Redirecting to Stripe checkout for ${plan.name} plan ($${plan.price}/${plan.interval})`);
    
    // In a real implementation, you would:
    // 1. Send user data and plan to your backend
    // 2. Create a Stripe checkout session on the backend
    // 3. Redirect to the checkout URL
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join Ship_fix</h1>
          <p className="text-gray-600 mt-2">Choose your plan and start optimizing your supply chain today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Plans */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Choose Your Plan</h2>
            
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-blue-500 border-blue-500' 
                    : 'hover:border-gray-300'
                } ${plan.popular ? 'border-blue-200' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPlan === plan.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === plan.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {plan.trial && <Star className="w-4 h-4 text-yellow-500" />}
                          {plan.id === 'pro' && <Crown className="w-4 h-4 text-purple-500" />}
                          {plan.name}
                        </CardTitle>
                        <CardDescription>
                          {plan.trial ? 'Start free, upgrade anytime' : 
                           plan.id === 'basic' ? 'Perfect for growing businesses' : 
                           'Enterprise-grade features'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      {plan.popular && (
                        <Badge variant="secondary" className="mb-1">Most Popular</Badge>
                      )}
                      <div className="text-2xl font-bold text-gray-900">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-500">
                          /{plan.interval}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Signup Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  Fill in your details to get started with your {
                    subscriptionPlans.find(p => p.id === selectedPlan)?.name || 'selected plan'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Acme Corp"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 characters"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Separator />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Selected Plan Summary</h4>
                    {(() => {
                      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
                      return plan ? (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{plan.name}</p>
                          <p>${plan.price}/{plan.interval}</p>
                          {plan.trial && (
                            <p className="text-green-600 mt-1">
                              ✓ No payment required for trial
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {selectedPlan === 'trial' ? 'Creating Account...' : 'Redirecting to Checkout...'}
                      </>
                    ) : (
                      <>
                        {selectedPlan === 'trial' ? 'Start Free Trial' : 'Continue to Payment'}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onShowLogin}
                      className="text-sm text-blue-600 hover:text-blue-500"
                      disabled={isLoading}
                    >
                      Already have an account? Sign in
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;