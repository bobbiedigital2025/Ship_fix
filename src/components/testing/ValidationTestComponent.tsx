import React, { useState } from 'react';
import { validateData, emailSchema, supportTicketSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Test component to verify validation and error handling
 */
export const ValidationTestComponent: React.FC = () => {
  const [emailTest, setEmailTest] = useState('');
  const [emailResult, setEmailResult] = useState<string>('');
  
  const [ticketData, setTicketData] = useState({
    customerName: '',
    customerEmail: '',
    category: 'technical' as const,
    severity: 'medium' as const,
    subject: '',
    description: '',
    priority: 5
  });
  const [ticketResult, setTicketResult] = useState<string>('');

  const testEmailValidation = () => {
    const result = validateData(emailSchema, emailTest);
    setEmailResult(result.success ? '✅ Valid email' : `❌ ${result.error}`);
  };

  const testTicketValidation = () => {
    const result = validateData(supportTicketSchema, ticketData);
    setTicketResult(result.success ? '✅ Valid ticket data' : `❌ ${result.error}`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validation Test Suite</CardTitle>
          <CardDescription>
            Test the new input validation and error handling utilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Email Validation Test */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Email Validation Test</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email to test"
                value={emailTest}
                onChange={(e) => setEmailTest(e.target.value)}
              />
              <Button onClick={testEmailValidation}>Validate</Button>
            </div>
            {emailResult && (
              <div className={`p-2 rounded ${emailResult.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
                {emailResult}
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>Try: test@example.com (valid) or invalid-email (invalid)</p>
            </div>
          </div>

          {/* Support Ticket Validation Test */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Support Ticket Validation Test</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Customer Name"
                value={ticketData.customerName}
                onChange={(e) => setTicketData({...ticketData, customerName: e.target.value})}
              />
              <Input
                placeholder="Customer Email"
                value={ticketData.customerEmail}
                onChange={(e) => setTicketData({...ticketData, customerEmail: e.target.value})}
              />
              <Input
                placeholder="Subject (min 5 chars)"
                value={ticketData.subject}
                onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
              />
              <Input
                placeholder="Description (min 10 chars)"
                value={ticketData.description}
                onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
              />
            </div>
            <Button onClick={testTicketValidation}>Validate Ticket</Button>
            {ticketResult && (
              <div className={`p-2 rounded ${ticketResult.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
                {ticketResult}
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>Fill in all fields to test validation. Try leaving fields empty or too short.</p>
            </div>
          </div>

          {/* Environment Validation Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Environment Validation Status</h3>
            <div className="p-3 bg-blue-100 rounded">
              <p className="text-sm">
                Environment validation runs automatically on app startup. 
                Check the browser console for validation results.
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};