import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  Mail, 
  TrendingUp, 
  Filter,
  Search,
  CheckCircle,
  User,
  Building,
  Star,
  Calendar,
  MessageSquare,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Bell
} from 'lucide-react';
import { SupportService } from '@/lib/support-service';
import { SupportTicket, SupportStats, CustomerProfile } from '@/types/support';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const AdminSupportDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [customersBySeverity, setCustomersBySeverity] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds to catch new tickets
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadData, refreshData]);

  useEffect(() => {
    if (selectedSeverity !== 'all') {
      loadCustomersBySeverity(selectedSeverity);
    }
  }, [selectedSeverity]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([
        SupportService.getTickets(),
        SupportService.getSupportStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
      setLastRefresh(new Date());
      
      // Show notification for new tickets
      const newTickets = ticketsData.filter(ticket => 
        ticket.createdAt.getTime() > (lastRefresh.getTime() - 60000) // Last minute
      );
      
      if (newTickets.length > 0 && !loading) {
        toast({
          title: `${newTickets.length} New Ticket${newTickets.length > 1 ? 's' : ''}`,
          description: `${newTickets.map(t => t.subject).join(', ')}`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading support data:', error);
      toast({
        title: "Error",
        description: "Failed to load support data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [lastRefresh, loading, toast]);

  const refreshData = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    try {
      const updatedTicket = await SupportService.updateTicketStatus(ticketId, newStatus);
      if (updatedTicket) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? updatedTicket : ticket
        ));
        toast({
          title: "Status Updated",
          description: `Ticket ${ticketId} status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      const success = await SupportService.deleteTicket(ticketId);
      if (success) {
        setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        toast({
          title: "Ticket Deleted",
          description: `Ticket ${ticketId} has been deleted`,
        });
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
    }
  };

  const loadCustomersBySeverity = async (severity: string) => {
    try {
      const customers = await SupportService.getCustomersBySeverity(severity);
      setCustomersBySeverity(customers);
    } catch (error) {
      console.error('Error loading customers by severity:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSeverity = selectedSeverity === 'all' || ticket.severity === selectedSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const severityChartData = stats ? [
    { name: 'Critical', value: stats.ticketsBySeverity.critical, color: SEVERITY_COLORS.critical },
    { name: 'High', value: stats.ticketsBySeverity.high, color: SEVERITY_COLORS.high },
    { name: 'Medium', value: stats.ticketsBySeverity.medium, color: SEVERITY_COLORS.medium },
    { name: 'Low', value: stats.ticketsBySeverity.low, color: SEVERITY_COLORS.low },
  ] : [];

  const categoryChartData = stats ? Object.entries(stats.ticketsByCategory).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
  })) : [];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Support Dashboard</h1>
          <p className="text-gray-600">Manage customer support tickets and track performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTickets || 0}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.openTickets || 0}</div>
            <p className="text-xs text-muted-foreground">-5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageResponseTime || 0}h</div>
            <p className="text-xs text-muted-foreground">-10% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.satisfactionScore || 0}/5</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="customers">Customers by Severity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Support Tickets
                    <Badge variant="outline">{filteredTickets.length} tickets</Badge>
                    {refreshing && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
                  </CardTitle>
                  <CardDescription>
                    Manage and track customer support requests - Real-time updates
                    <span className="ml-2 text-xs text-gray-500">
                      Last updated: {format(lastRefresh, 'HH:mm:ss')}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={refreshData} variant="outline" size="sm" disabled={refreshing}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets by customer, email, or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            {loading ? 'Loading tickets...' : 'No tickets found matching your criteria'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.customerName}</div>
                              <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                              {ticket.company && (
                                <div className="text-sm text-gray-500">{ticket.company}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium truncate">{ticket.subject}</div>
                              <div className="text-xs text-gray-500">ID: {ticket.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{ticket.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(ticket.severity)}
                              <Badge 
                                variant={ticket.severity === 'critical' || ticket.severity === 'high' ? 'destructive' : 'secondary'}
                              >
                                {ticket.severity}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={ticket.status} 
                              onValueChange={(value) => handleStatusChange(ticket.id, value as 'open' | 'in-progress' | 'resolved' | 'closed')}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                              <div className="text-xs text-gray-500">
                                {format(new Date(ticket.createdAt), 'HH:mm')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" title="View Details">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" title="Edit Ticket">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" title="Send Email">
                                <Mail className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Delete Ticket"
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredTickets.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customers by Severity Level</CardTitle>
              <CardDescription>
                View customers who have submitted tickets at each severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSeverity === 'all' ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please select a severity level to view customers.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(selectedSeverity)}
                    <h3 className="text-lg font-semibold capitalize">
                      {selectedSeverity} Severity Customers
                    </h3>
                    <Badge variant="outline">{customersBySeverity.length} customers</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customersBySeverity.map((customer) => (
                      <Card key={customer.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{customer.name}</h4>
                                <p className="text-sm text-gray-500">{customer.email}</p>
                              </div>
                            </div>
                            <Badge className={getTierBadgeColor(customer.tier)}>
                              {customer.tier}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{customer.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{customer.totalTickets} total tickets</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{customer.openTickets} open tickets</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{customer.avgResponseTime}h avg response</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{customer.satisfactionScore}/5 satisfaction</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Tier Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats && Object.entries(stats.customersByTier).map(([tier, customers]) => (
                  <Card key={tier}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 capitalize">{tier}</p>
                          <p className="text-2xl font-bold">{customers.length}</p>
                        </div>
                        <Badge className={getTierBadgeColor(tier)}>
                          {tier}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {customers.slice(0, 3).join(', ')}
                          {customers.length > 3 && ` +${customers.length - 3} more`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSupportDashboard;
