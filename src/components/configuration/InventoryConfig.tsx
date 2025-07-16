import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentStock: number;
  manager: string;
  type: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplierId: string;
  warehouseId: string;
  reorderPoint: number;
  safetyStock: number;
  currentStock: number;
  leadTime: number;
}

const InventoryConfig: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'Main Distribution Center',
      address: '123 Industrial Blvd, City, State',
      capacity: 10000,
      currentStock: 7500,
      manager: 'Sarah Johnson',
      type: 'Distribution'
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      sku: 'PROD-001',
      name: 'Premium Widget',
      category: 'Electronics',
      supplierId: '1',
      warehouseId: '1',
      reorderPoint: 100,
      safetyStock: 50,
      currentStock: 250,
      leadTime: 7
    }
  ]);

  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState<Partial<Warehouse>>({});
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  const warehouseTypes = ['Distribution', 'Manufacturing', 'Retail', 'Cross-dock'];
  const categories = ['Electronics', 'Clothing', 'Food', 'Industrial', 'Healthcare'];

  const handleAddWarehouse = () => {
    if (newWarehouse.name && newWarehouse.address) {
      setWarehouses([...warehouses, { ...newWarehouse, id: Date.now().toString() } as Warehouse]);
      setNewWarehouse({});
      setIsAddWarehouseOpen(false);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.sku && newProduct.name) {
      setProducts([...products, { ...newProduct, id: Date.now().toString() } as Product]);
      setNewProduct({});
      setIsAddProductOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="warehouses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="products">Products & SKUs</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Locations</CardTitle>
              <CardDescription>
                Manage your inventory locations and their capacities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Locations</h3>
                <Dialog open={isAddWarehouseOpen} onOpenChange={setIsAddWarehouseOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Location
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Warehouse</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div>
                        <Label htmlFor="warehouseName">Warehouse Name</Label>
                        <Input
                          id="warehouseName"
                          value={newWarehouse.name || ''}
                          onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={(value) => setNewWarehouse({...newWarehouse, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouseTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={newWarehouse.address || ''}
                          onChange={(e) => setNewWarehouse({...newWarehouse, address: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddWarehouse}>Add Warehouse</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {warehouses.map((warehouse) => (
                  <Card key={warehouse.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{warehouse.name}</h4>
                          <Badge variant="secondary">{warehouse.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{warehouse.address}</p>
                        <p className="text-sm text-gray-600 mb-2">Manager: {warehouse.manager}</p>
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

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product & SKU Management</CardTitle>
              <CardDescription>
                Link products to suppliers, warehouses, and shipping methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{product.name}</h4>
                          <Badge variant="outline">{product.sku}</Badge>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Current Stock:</span>
                            <p className="font-medium">{product.currentStock}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Reorder Point:</span>
                            <p className="font-medium">{product.reorderPoint}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Safety Stock:</span>
                            <p className="font-medium">{product.safetyStock}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Lead Time:</span>
                            <p className="font-medium">{product.leadTime} days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder">
          <Card>
            <CardHeader>
              <CardTitle>Reorder Point Automation</CardTitle>
              <CardDescription>
                Configure automatic reorder triggers and purchase order generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Safety Stock %</Label>
                    <Input type="number" placeholder="20" />
                  </div>
                  <div>
                    <Label>Reorder Lead Time Buffer (days)</Label>
                    <Input type="number" placeholder="3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryConfig;