import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SupportTicket } from '@/types/support';

interface NotificationProps {
  ticket: SupportTicket;
  onDismiss: () => void;
  onView: () => void;
}

export function TicketNotification({ ticket, onDismiss, onView }: NotificationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300); // Wait for animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  if (!show) return null;

  return (
    <Card className={`fixed top-4 right-4 z-50 w-80 transition-all duration-300 transform ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } shadow-lg border-l-4 ${getSeverityColor(ticket.severity)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-sm">New Support Ticket</span>
            <Badge variant={ticket.severity === 'critical' || ticket.severity === 'high' ? 'destructive' : 'secondary'}>
              {ticket.severity}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShow(false);
              setTimeout(onDismiss, 300);
            }}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="mt-2">
          <p className="font-medium text-sm">{ticket.subject}</p>
          <p className="text-xs text-gray-600">From: {ticket.customerName}</p>
          <p className="text-xs text-gray-600">ID: {ticket.id}</p>
        </div>
        
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={onView} className="flex-1">
            View Ticket
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setShow(false);
              setTimeout(onDismiss, 300);
            }}
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface NotificationManagerProps {
  children: React.ReactNode;
}

export function NotificationManager({ children }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<SupportTicket[]>([]);

  // Listen for new tickets (in a real app, this would be via WebSocket or polling)
  useEffect(() => {
    const handleNewTicket = (event: CustomEvent<SupportTicket>) => {
      setNotifications(prev => [...prev, event.detail]);
    };

    window.addEventListener('new-support-ticket', handleNewTicket as EventListener);
    return () => window.removeEventListener('new-support-ticket', handleNewTicket as EventListener);
  }, []);

  const dismissNotification = (ticketId: string) => {
    setNotifications(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const viewTicket = (ticketId: string) => {
    // Navigate to admin dashboard with the ticket highlighted
    window.location.hash = '#admin';
    dismissNotification(ticketId);
  };

  return (
    <>
      {children}
      {notifications.map((ticket, index) => (
        <div
          key={ticket.id}
          style={{ top: `${4 + index * 100}px` }}
          className="fixed right-4 z-50"
        >
          <TicketNotification
            ticket={ticket}
            onDismiss={() => dismissNotification(ticket.id)}
            onView={() => viewTicket(ticket.id)}
          />
        </div>
      ))}
    </>
  );
}

// Helper function to trigger notification
export function triggerNewTicketNotification(ticket: SupportTicket) {
  const event = new CustomEvent('new-support-ticket', { detail: ticket });
  window.dispatchEvent(event);
}
