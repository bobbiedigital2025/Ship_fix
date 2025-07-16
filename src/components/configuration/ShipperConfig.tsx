import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Carrier {
  id: string;
  name: string;
  accountNumber: string;
  serviceLevel: string;
  apiEndpoint?: string;
  trackingUrl: string;
  avgCost: number;
  avgTransitTime: number;
}

interface RateCard {
  id: string;
  carrierId: string;
  serviceLevel: string;
  zone: string;
  weight: string;
  rate: number;
}

const ShipperConfig: React.FC = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([
    {
      id: '1',
      name: 'FedEx',
      accountNumber: 'FX123456',
      serviceLevel: 'Express',
      apiEndpoint: 'https://api.fedex.com/track',
      trackingUrl: 'https://fedex.com/track',
      avgCost: 25.50,
      avgTransitTime: 2
    }
  ]);

  const [rateCards, setRateCards] = useState<RateCard[]>([
    {
      id: '1',
      carrierId: '1',
      serviceLevel: 'Express',
      zone: 'Zone 1',
      weight: '0-5 lbs',
      rate: 15.99
    }
  ]);

  const [isAddCarrierOpen, setIsAddCarrierOpen] = useState(false);
  const [newCarrier, setNewCarrier] = useState<Partial<Carrier>>({});

  const serviceLevels = ['Express', 'Standard', 'Ground', 'Overnight', '2-Day'];

  const handleAddCarrier = () => {
    if (newCarrier.name && newCarrier.accountNumber) {
      setCarriers([...carriers, { ...newCarrier, id: Date.now().toString() } as Carrier]);
      setNewCarrier({});
      setIsAddCarrierOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="carriers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="routes">Route Preferences</TabsTrigger>
          <TabsTrigger value="rates">Rate Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="carriers">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Carriers</CardTitle>
              <CardDescription>
                Configure your shipping partners and their service levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Carriers</h3>
                <Dialog open={isAddCarrierOpen} onOpenChange={setIsAddCarrierOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Carrier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Carrier</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div>
                        <Label htmlFor="carrierName">Carrier Name</Label>
                        <Input
                          id="carrierName"
                          value={newCarrier.name || ''}
                          onChange={(e) => setNewCarrier({...newCarrier, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={newCarrier.accountNumber || ''}
                          onChange={(e) => setNewCarrier({...newCarrier, accountNumber: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceLevel">Service Level</Label>
                        <Select onValueChange={(value) => setNewCarrier({...newCarrier, serviceLevel: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service level" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceLevels.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="apiEndpoint">API Endpoint (Optional)</Label>
                        <Input
                          id="apiEndpoint"
                          value={newCarrier.apiEndpoint || ''}
                          onChange={(e) => setNewCarrier({...newCarrier, apiEndpoint: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="trackingUrl">Tracking URL</Label>
                        <Input
                          id="trackingUrl"
                          value={newCarrier.trackingUrl || ''}
                          onChange={(e) => setNewCarrier({...newCarrier, trackingUrl: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCarrier}>Add Carrier</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {carriers.map((carrier) => (
                  <Card key={carrier.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{carrier.name}</h4>
                          <Badge variant="secondary">{carrier.serviceLevel}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Account: {carrier.accountNumber}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Avg Cost:</span>
                            <p className="font-medium">${carrier.avgCost}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Avg Transit:</span>
                            <p className="font-medium">{carrier.avgTransitTime} days</p>
                          </div>
                          <div>
                            <span className="text-gray-500">API Status:</span>
                            <Badge variant={carrier.apiEndpoint ? 'default' : 'secondary'}>
                              {carrier.apiEndpoint ? 'Connected' : 'Manual'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization Preferences</CardTitle>
              <CardDescription>
                Configure preferred shipping routes and optimization criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Cost Threshold</Label>
                    <Input type="number" placeholder="Maximum cost per shipment" />
                  </div>
                  <div>
                    <Label>Transit Time Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reliability Weight</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Custom Rate Cards</CardTitle>
              <CardDescription>
                Upload or manually input your negotiated shipping rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Rate Cards</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Rate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {rateCards.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{carriers.find(c => c.id === rate.carrierId)?.name}</span>
                      <Badge variant="outline">{rate.serviceLevel}</Badge>
                      <span className="text-sm text-gray-600">{rate.zone} • {rate.weight}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${rate.rate}</span>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipperConfig;