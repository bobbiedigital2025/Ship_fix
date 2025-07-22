import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Effective Date: July 21, 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Personal Information</h4>
              <p className="text-gray-700">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>Name, email address, and contact information</li>
                <li>Company information and job title</li>
                <li>Account credentials and preferences</li>
                <li>Payment and billing information</li>
                <li>Support tickets and communication history</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Automatically Collected Information</h4>
              <p className="text-gray-700">
                We automatically collect certain information when you use our services:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Usage patterns and feature interactions</li>
                <li>Supply chain and shipment data you input</li>
                <li>Tariff analysis and automation logs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Cookies and Tracking Technologies</h4>
              <p className="text-gray-700">
                We use cookies, web beacons, and similar technologies to enhance your experience 
                and analyze service usage. This includes:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>Essential cookies for service functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Advertising cookies for Google Ads and marketing</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Provide and maintain our supply chain automation services</li>
              <li>Process tariff analysis and cost optimization</li>
              <li>Execute MCP automation and A2A transactions</li>
              <li>Send service notifications and support communications</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Deliver targeted advertising through Google Ads</li>
              <li>Analyze usage patterns and service performance</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Service Providers:</strong> With trusted third parties who assist in our operations</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              <li><strong>Google Ads:</strong> Anonymized data for advertising optimization</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication systems</li>
              <li>Secure data storage with Supabase infrastructure</li>
              <li>MCP authentication for automated transactions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">You have the following rights regarding your information:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Cookie Control:</strong> Manage cookie preferences through our consent banner</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Google Ads and Advertising</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We use Google Ads to deliver relevant advertising. This includes:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              <li>Tracking conversions and ad performance</li>
              <li>Remarketing to previous visitors</li>
              <li>Interest-based advertising</li>
              <li>Demographic and geographic targeting</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can opt-out of personalized ads by visiting 
              <a href="https://adssettings.google.com" className="text-blue-600 hover:underline"> Google Ads Settings</a>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with applicable data protection laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Our services are not intended for children under 13. We do not knowingly collect 
              personal information from children under 13. If we become aware of such collection, 
              we will delete the information promptly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the effective date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Bobbie Digital</strong></p>
              <p>Email: privacy@bobbiedigital.com</p>
              <p>Support: marketing-support@bobbiedigital.com</p>
              <p>Website: bobbiedigital.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
