import React, { useState, useEffect } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { SupportService } from '@/lib/support-service';
import { SupportTicket, SupportStats, CustomerProfile } from '@/types/support';
import { format } from 'date-fns';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSeverity !== 'all') {
      loadCustomersBySeverity(selectedSeverity);
    }
  }, [selectedSeverity]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([
        SupportService.getTickets(),
        SupportService.getSupportStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading support data:', error);
    } finally {
      setLoading(false);
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
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                Manage and track all customer support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
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
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{ticket.customerName}</div>
                            <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                            {ticket.company && (
                              <div className="text-sm text-gray-500">{ticket.company}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(ticket.severity)}
                            <Badge className={SupportService.getPriorityColor(ticket.severity)}>
                              {ticket.severity}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={SupportService.getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Reply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
