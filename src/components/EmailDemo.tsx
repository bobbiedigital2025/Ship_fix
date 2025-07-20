import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Send, CheckCircle, XCircle } from 'lucide-react';
import { 
  useEmail, 
  useWelcomeEmail, 
  useSupportEmail, 
  useNotificationEmail,
  useOrderEmail,
  usePasswordResetEmail 
} from '@/hooks/use-email';

export function EmailDemoComponent() {
  const [customEmail, setCustomEmail] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const [welcomeData, setWelcomeData] = useState({
    email: '',
    name: ''
  });

  const [supportData, setSupportData] = useState({
    email: '',
    name: '',
    ticketId: '',
    subject: ''
  });

  const [notificationData, setNotificationData] = useState({
    recipient: '',
    title: '',
    message: '',
    actionUrl: ''
  });

  const [orderData, setOrderData] = useState({
    email: '',
    name: '',
    orderId: ''
  });

  const [resetData, setResetData] = useState({
    email: '',
    name: '',
    resetUrl: ''
  });

  // Hooks
  const { loading: customLoading, success: customSuccess, error: customError, sendEmail } = useEmail();
  const { loading: welcomeLoading, success: welcomeSuccess, error: welcomeError, sendWelcomeEmail } = useWelcomeEmail();
  const { loading: supportLoading, success: supportSuccess, error: supportError, sendSupportConfirmation, notifySupportTeam } = useSupportEmail();
  const { loading: notificationLoading, success: notificationSuccess, error: notificationError, sendNotification } = useNotificationEmail();
  const { loading: orderLoading, success: orderSuccess, error: orderError, sendOrderConfirmation } = useOrderEmail();
  const { loading: resetLoading, success: resetSuccess, error: resetError, sendPasswordReset } = usePasswordResetEmail();

  const handleCustomEmail = async () => {
    await sendEmail({
      to: customEmail.to,
      subject: customEmail.subject,
      html: `<p>${customEmail.message}</p>`,
      text: customEmail.message
    });
  };

  const handleWelcomeEmail = async () => {
    await sendWelcomeEmail(welcomeData.email, welcomeData.name);
  };

  const handleSupportEmail = async () => {
    await sendSupportConfirmation(
      supportData.email,
      supportData.name,
      supportData.ticketId,
      supportData.subject
    );
  };

  const handleNotificationEmail = async () => {
    await sendNotification(
      notificationData.recipient,
      notificationData.title,
      notificationData.message,
      notificationData.actionUrl || undefined
    );
  };

  const handleOrderEmail = async () => {
    await sendOrderConfirmation(
      orderData.email,
      orderData.name,
      orderData.orderId,
      {}
    );
  };

  const handlePasswordReset = async () => {
    await sendPasswordReset(
      resetData.email,
      resetData.resetUrl,
      resetData.name
    );
  };

  const StatusIndicator = ({ loading, success, error }: { loading: boolean, success: boolean, error: string | null }) => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="h-8 w-8" />
          Resend Email API Demo
        </h1>
        <p className="text-muted-foreground mt-2">
          Test the various email endpoints and templates using your Resend API key.
        </p>
      </div>

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="notification">Notify</TabsTrigger>
          <TabsTrigger value="order">Order</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Custom Email
                <StatusIndicator loading={customLoading} success={customSuccess} error={customError} />
              </CardTitle>
              <CardDescription>
                Send a custom email with your own content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-to">Recipient Email</Label>
                <Input
                  id="custom-to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={customEmail.to}
                  onChange={(e) => setCustomEmail(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="custom-subject">Subject</Label>
                <Input
                  id="custom-subject"
                  placeholder="Email subject"
                  value={customEmail.subject}
                  onChange={(e) => setCustomEmail(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="custom-message">Message</Label>
                <Textarea
                  id="custom-message"
                  placeholder="Your email message..."
                  rows={4}
                  value={customEmail.message}
                  onChange={(e) => setCustomEmail(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleCustomEmail} 
                disabled={customLoading || !customEmail.to || !customEmail.subject}
                className="w-full"
              >
                {customLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Custom Email
              </Button>
              {customError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{customError}</AlertDescription>
                </Alert>
              )}
              {customSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Custom email sent successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welcome">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Welcome Email
                <StatusIndicator loading={welcomeLoading} success={welcomeSuccess} error={welcomeError} />
              </CardTitle>
              <CardDescription>
                Send a welcome email to new users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="welcome-email">User Email</Label>
                <Input
                  id="welcome-email"
                  type="email"
                  placeholder="user@example.com"
                  value={welcomeData.email}
                  onChange={(e) => setWelcomeData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="welcome-name">User Name</Label>
                <Input
                  id="welcome-name"
                  placeholder="John Doe"
                  value={welcomeData.name}
                  onChange={(e) => setWelcomeData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleWelcomeEmail} 
                disabled={welcomeLoading || !welcomeData.email || !welcomeData.name}
                className="w-full"
              >
                {welcomeLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Welcome Email
              </Button>
              {welcomeError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{welcomeError}</AlertDescription>
                </Alert>
              )}
              {welcomeSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Welcome email sent successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Support Ticket Email
                <StatusIndicator loading={supportLoading} success={supportSuccess} error={supportError} />
              </CardTitle>
              <CardDescription>
                Send support ticket confirmation to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="support-email">Customer Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  placeholder="customer@example.com"
                  value={supportData.email}
                  onChange={(e) => setSupportData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="support-name">Customer Name</Label>
                <Input
                  id="support-name"
                  placeholder="Jane Smith"
                  value={supportData.name}
                  onChange={(e) => setSupportData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="support-ticket">Ticket ID</Label>
                <Input
                  id="support-ticket"
                  placeholder="TICKET-12345"
                  value={supportData.ticketId}
                  onChange={(e) => setSupportData(prev => ({ ...prev, ticketId: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="support-subject">Ticket Subject</Label>
                <Input
                  id="support-subject"
                  placeholder="Unable to login to account"
                  value={supportData.subject}
                  onChange={(e) => setSupportData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleSupportEmail} 
                disabled={supportLoading || !supportData.email || !supportData.name || !supportData.ticketId}
                className="w-full"
              >
                {supportLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Support Confirmation
              </Button>
              {supportError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{supportError}</AlertDescription>
                </Alert>
              )}
              {supportSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Support ticket confirmation sent!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Notification Email
                <StatusIndicator loading={notificationLoading} success={notificationSuccess} error={notificationError} />
              </CardTitle>
              <CardDescription>
                Send notification emails with optional action buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notification-recipient">Recipient</Label>
                <Input
                  id="notification-recipient"
                  type="email"
                  placeholder="recipient@example.com"
                  value={notificationData.recipient}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, recipient: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notification-title">Title</Label>
                <Input
                  id="notification-title"
                  placeholder="Important Update"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notification-message">Message</Label>
                <Textarea
                  id="notification-message"
                  placeholder="Your notification message..."
                  rows={3}
                  value={notificationData.message}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notification-action">Action URL (Optional)</Label>
                <Input
                  id="notification-action"
                  placeholder="https://example.com/action"
                  value={notificationData.actionUrl}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, actionUrl: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleNotificationEmail} 
                disabled={notificationLoading || !notificationData.recipient || !notificationData.title || !notificationData.message}
                className="w-full"
              >
                {notificationLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Notification
              </Button>
              {notificationError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{notificationError}</AlertDescription>
                </Alert>
              )}
              {notificationSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Notification sent successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Order Confirmation Email
                <StatusIndicator loading={orderLoading} success={orderSuccess} error={orderError} />
              </CardTitle>
              <CardDescription>
                Send order confirmation emails to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="order-email">Customer Email</Label>
                <Input
                  id="order-email"
                  type="email"
                  placeholder="customer@example.com"
                  value={orderData.email}
                  onChange={(e) => setOrderData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="order-name">Customer Name</Label>
                <Input
                  id="order-name"
                  placeholder="John Customer"
                  value={orderData.name}
                  onChange={(e) => setOrderData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="order-id">Order ID</Label>
                <Input
                  id="order-id"
                  placeholder="ORD-12345"
                  value={orderData.orderId}
                  onChange={(e) => setOrderData(prev => ({ ...prev, orderId: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleOrderEmail} 
                disabled={orderLoading || !orderData.email || !orderData.name || !orderData.orderId}
                className="w-full"
              >
                {orderLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Order Confirmation
              </Button>
              {orderError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{orderError}</AlertDescription>
                </Alert>
              )}
              {orderSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Order confirmation sent successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Password Reset Email
                <StatusIndicator loading={resetLoading} success={resetSuccess} error={resetError} />
              </CardTitle>
              <CardDescription>
                Send password reset emails with secure links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reset-email">User Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="user@example.com"
                  value={resetData.email}
                  onChange={(e) => setResetData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="reset-name">User Name (Optional)</Label>
                <Input
                  id="reset-name"
                  placeholder="John Doe"
                  value={resetData.name}
                  onChange={(e) => setResetData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="reset-url">Reset URL</Label>
                <Input
                  id="reset-url"
                  placeholder="https://yourapp.com/reset-password?token=..."
                  value={resetData.resetUrl}
                  onChange={(e) => setResetData(prev => ({ ...prev, resetUrl: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handlePasswordReset} 
                disabled={resetLoading || !resetData.email || !resetData.resetUrl}
                className="w-full"
              >
                {resetLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Password Reset
              </Button>
              {resetError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{resetError}</AlertDescription>
                </Alert>
              )}
              {resetSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Password reset email sent successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
