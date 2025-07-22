import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Effective Date: July 21, 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              By accessing or using Ship_fix ("Service"), provided by Bobbie Digital ("Company", "we", "us", or "our"), 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
              do not use the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Ship_fix is a supply chain automation platform that provides:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Real-time tariff monitoring and impact analysis</li>
              <li>Automated supply chain optimization</li>
              <li>MCP (Model Context Protocol) powered automation</li>
              <li>A2A (Account-to-Account) cost mitigation</li>
              <li>Shipping route optimization</li>
              <li>Compliance monitoring and documentation</li>
              <li>Supplier alternative recommendations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Account Creation</h4>
                <p className="text-gray-700">
                  You must create an account to use certain features of the Service. You agree to:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold">Account Eligibility</h4>
                <p className="text-gray-700">
                  You must be at least 18 years old and have the legal authority to enter into these Terms 
                  on behalf of yourself or your organization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Permitted Use</h4>
                <p className="text-gray-700">
                  You may use the Service for legitimate business purposes related to supply chain management 
                  and automation.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Prohibited Activities</h4>
                <p className="text-gray-700 mb-2">You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any systems</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Misuse automation features for fraudulent purposes</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. MCP Automation and A2A Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Automated Actions</h4>
                <p className="text-gray-700">
                  By using our automation features, you authorize us to:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  <li>Execute automated supply chain optimizations</li>
                  <li>Process A2A credit transactions for tariff mitigation</li>
                  <li>Make pricing adjustments based on cost impacts</li>
                  <li>Send automated notifications to stakeholders</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold">Financial Transactions</h4>
                <p className="text-gray-700">
                  A2A transactions are subject to your account limits and billing terms. 
                  You are responsible for all charges incurred through automated actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data and Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Your Data</h4>
                <p className="text-gray-700">
                  You retain ownership of your supply chain data. By using the Service, you grant us 
                  a license to process your data to provide the Service.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Data Security</h4>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your data. However, 
                  no method of transmission or storage is 100% secure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Subscription Plans</h4>
                <p className="text-gray-700">
                  Our Service is offered through various subscription plans. Pricing and features 
                  are as described on our website at the time of purchase.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Billing and Refunds</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Subscriptions are billed in advance</li>
                  <li>Automatic renewal unless cancelled</li>
                  <li>Refunds subject to our refund policy</li>
                  <li>A2A transaction fees as disclosed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              The Service and its original content, features, and functionality are owned by Bobbie Digital 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Disclaimers and Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Service Disclaimers</h4>
                <p className="text-gray-700">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. 
                  WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS 
                  FOR A PARTICULAR PURPOSE.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Tariff Analysis Disclaimer</h4>
                <p className="text-gray-700">
                  Tariff analysis and predictions are for informational purposes only. We do not guarantee 
                  the accuracy of tariff data or the effectiveness of cost mitigation strategies.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Limitation of Liability</h4>
                <p className="text-gray-700">
                  IN NO EVENT SHALL BOBBIE DIGITAL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR DATA.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We may terminate or suspend your account and access to the Service immediately, without prior 
              notice, for conduct that we believe violates these Terms or is harmful to other users, us, 
              or third parties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify you of any material 
              changes by posting the new Terms on this page and updating the effective date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Bobbie Digital</strong></p>
              <p>Email: legal@bobbiedigital.com</p>
              <p>Support: marketing-support@bobbiedigital.com</p>
              <p>Website: bobbiedigital.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
