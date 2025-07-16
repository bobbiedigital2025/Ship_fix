import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  onTimeRate: number;
  qualityScore: number;
  leadTime: number;
  cost: number;
  reliability: number;
}

const SupplierConfig: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Global Materials Inc',
      category: 'Raw Materials',
      contact: 'John Smith',
      email: 'john@globalmaterials.com',
      onTimeRate: 95,
      qualityScore: 4.8,
      leadTime: 7,
      cost: 85,
      reliability: 4.5
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});

  const categories = ['Raw Materials', 'Finished Goods', 'Components', 'Packaging', 'Services'];

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.category) {
      setSuppliers([...suppliers, { ...newSupplier, id: Date.now().toString() } as Supplier]);
      setNewSupplier({});
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
          <CardDescription>
            Configure your suppliers, set performance metrics, and define preferred supplier rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Active Suppliers</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Supplier Name</Label>
                    <Input
                      id="name"
                      value={newSupplier.name || ''}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setNewSupplier({...newSupplier, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      id="contact"
                      value={newSupplier.contact || ''}
                      onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newSupplier.email || ''}
                      onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleAddSupplier}>Add Supplier</Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{supplier.name}</h4>
                      <Badge variant="secondary">{supplier.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{supplier.contact} • {supplier.email}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">On-Time Rate:</span>
                        <p className="font-medium">{supplier.onTimeRate}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Quality Score:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{supplier.qualityScore}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Lead Time:</span>
                        <p className="font-medium">{supplier.leadTime} days</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Reliability:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{supplier.reliability}</span>
                        </div>
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
    </div>
  );
};

export default SupplierConfig;