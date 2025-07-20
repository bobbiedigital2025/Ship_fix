# Resend Email API Integration

This directory contains a complete Resend email API integration with React hooks, service classes, and demo components.

## 🚀 Quick Start

### 1. Environment Setup

Make sure your `.env` file contains the Resend API key:

```bash
# For server-side usage
RESEND_API_KEY=re_your_api_key_here

# For client-side usage (if needed)
VITE_RESEND_API_KEY=re_your_api_key_here
```

### 2. Install Dependencies

Resend is already installed in your project:

```bash
npm install resend
```

### 3. Basic Usage

```tsx
import { ResendEmailService } from '@/api/email-service';
import { useWelcomeEmail } from '@/hooks/use-email';

// Using service directly
const result = await ResendEmailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Using React hook
const { sendWelcomeEmail, loading, success, error } = useWelcomeEmail();
await sendWelcomeEmail('user@example.com', 'John Doe');
```

## 📁 File Structure

```
src/api/
├── email.ts           # Low-level Resend API wrapper
├── email-service.ts   # High-level service class
└── index.ts          # Exports

src/hooks/
└── use-email.ts      # React hooks for email operations

src/components/
└── EmailDemo.tsx     # Demo component
```

## 🔧 API Reference

### Core Functions (`email.ts`)

#### `sendEmail(emailData: EmailData)`
Send a single email.

```tsx
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello World',
  html: '<p>Hello from React!</p>',
  text: 'Hello from React!'
});
```

#### `sendBatchEmails(batchData: BatchEmailData)`
Send multiple emails at once.

```tsx
await sendBatchEmails({
  emails: [
    { to: 'user1@example.com', subject: 'Subject 1', html: '<p>Message 1</p>' },
    { to: 'user2@example.com', subject: 'Subject 2', html: '<p>Message 2</p>' }
  ]
});
```

#### `getEmailStatus(emailId: string)`
Check the delivery status of an email.

```tsx
const status = await getEmailStatus('email-id-here');
```

#### `updateScheduledEmail(emailId: string, scheduledAt: string)`
Update the scheduled time for an email.

```tsx
await updateScheduledEmail('email-id', '2024-12-25T09:00:00Z');
```

#### `cancelEmail(emailId: string)`
Cancel a scheduled email.

```tsx
await cancelEmail('email-id');
```

### Service Class (`email-service.ts`)

#### `ResendEmailService.sendWelcomeEmail(userEmail, userName)`
Send a branded welcome email to new users.

#### `ResendEmailService.sendSupportTicketConfirmation(customerEmail, customerName, ticketId, subject)`
Send support ticket confirmation to customers.

#### `ResendEmailService.notifySupportTeam(subject, message, priority)`
Notify the support team of issues or updates.

#### `ResendEmailService.sendNotification(recipient, title, message, actionUrl?)`
Send general notifications with optional action buttons.

#### `ResendEmailService.sendOrderConfirmation(customerEmail, customerName, orderId, orderDetails)`
Send order confirmation emails.

#### `ResendEmailService.sendPasswordReset(userEmail, resetUrl, userName?)`
Send password reset emails with secure links.

#### `ResendEmailService.sendBulkNotifications(recipients, title, message)`
Send the same notification to multiple recipients.

### React Hooks (`use-email.ts`)

All hooks return `{ loading, success, error, emailId }` state and the appropriate send function.

#### `useEmail()`
Generic email sending hook.

```tsx
const { sendEmail, loading, success, error } = useEmail();

const handleSend = async () => {
  await sendEmail({
    to: 'user@example.com',
    subject: 'Custom Email',
    html: '<p>Hello!</p>'
  });
};
```

#### `useWelcomeEmail()`
Hook for welcome emails.

```tsx
const { sendWelcomeEmail, loading, success, error } = useWelcomeEmail();

const handleWelcome = async () => {
  await sendWelcomeEmail('user@example.com', 'John Doe');
};
```

#### `useSupportEmail()`
Hook for support-related emails.

```tsx
const { sendSupportConfirmation, notifySupportTeam, loading, success, error } = useSupportEmail();
```

#### `useNotificationEmail()`
Hook for notification emails.

```tsx
const { sendNotification, sendBulkNotifications, loading, success, error } = useNotificationEmail();
```

#### `useOrderEmail()`
Hook for order confirmation emails.

```tsx
const { sendOrderConfirmation, loading, success, error } = useOrderEmail();
```

#### `usePasswordResetEmail()`
Hook for password reset emails.

```tsx
const { sendPasswordReset, loading, success, error } = usePasswordResetEmail();
```

## 📧 Email Templates

Built-in templates are available in `emailTemplates`:

- `emailTemplates.welcome(name, companyName)` - Welcome email
- `emailTemplates.supportTicket(ticketId, customerName, subject)` - Support ticket confirmation
- `emailTemplates.notification(title, message, actionUrl?)` - General notification

## 🎨 Demo Component

The `EmailDemo` component provides a complete UI for testing all email functions:

```tsx
import { EmailDemo } from '@/components/EmailDemo';

function App() {
  return <EmailDemo />;
}
```

## ⚙️ Configuration

### Environment Variables

```bash
# Required
RESEND_API_KEY=re_your_api_key_here

# Optional - for client-side usage
VITE_RESEND_API_KEY=re_your_api_key_here

# Company settings (used in templates)
VITE_COMPANY_NAME=Your Company Name
VITE_SUPPORT_EMAIL=support@yourcompany.com
```

### Default Settings

- **Default FROM email**: `no-reply@bobbiedigital.com`
- **Support email**: From `VITE_SUPPORT_EMAIL` or `support@bobbiedigital.com`
- **Company name**: From `VITE_COMPANY_NAME` or `Your Company`

## 🛡️ Security Best Practices

1. **Server-side for sensitive operations**: Use `RESEND_API_KEY` (without VITE_ prefix) for server-side operations
2. **Client-side for non-sensitive**: Use `VITE_RESEND_API_KEY` only for non-sensitive operations
3. **Validate inputs**: Always validate email addresses and content before sending
4. **Rate limiting**: Implement rate limiting to prevent abuse
5. **Error handling**: Properly handle and log errors

## 🔍 Error Handling

All functions return a consistent response format:

```tsx
{
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}
```

Example error handling:

```tsx
const result = await ResendEmailService.sendWelcomeEmail('user@example.com', 'John');

if (result.success) {
  console.log('Email sent!', result.data);
} else {
  console.error('Failed to send email:', result.error);
}
```

## 🧪 Testing

Use the demo component to test all email functions:

1. Navigate to your app
2. Import and render `<EmailDemo />`
3. Test different email types with real email addresses
4. Check the console for detailed logs

## 📝 Customization

### Custom Templates

Create your own email templates:

```tsx
const customTemplate = {
  subject: 'Custom Subject',
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h1>Custom Email</h1>
      <p>Your custom content here</p>
    </div>
  `,
  text: 'Custom Email\n\nYour custom content here'
};

await sendEmail({
  to: 'user@example.com',
  ...customTemplate
});
```

### Custom Hooks

Create custom hooks for specific use cases:

```tsx
export function useInvoiceEmail() {
  const { sendEmail, ...state } = useEmail();
  
  const sendInvoice = async (customerEmail: string, invoiceData: any) => {
    return await sendEmail({
      to: customerEmail,
      subject: `Invoice #${invoiceData.id}`,
      html: generateInvoiceHTML(invoiceData),
      text: generateInvoiceText(invoiceData)
    });
  };
  
  return { sendInvoice, ...state };
}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key not working**: Make sure the API key is correctly set in `.env`
2. **CORS errors**: API calls from browser may fail - use server-side endpoints instead
3. **Rate limiting**: Resend has rate limits - implement proper error handling
4. **Email not received**: Check spam folder, verify recipient email address

### Debug Mode

In development mode, emails are logged to console instead of being sent:

```tsx
// This will log email details instead of sending in development
if (import.meta.env.DEV) {
  console.log('📧 Email would be sent (DEV MODE):', emailData);
}
```

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend React Guide](https://resend.com/docs/send-with-react)
- [Email Templates](https://resend.com/docs/dashboard/emails/send)
