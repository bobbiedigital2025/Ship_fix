import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  status: 'active' | 'delayed' | 'issues';
  reliability: number;
  onTimeDelivery: number;
  qualityScore: number;
}

const mockSuppliers: Supplier[] = [
  { id: '1', name: 'Global Tech Supply', status: 'active', reliability: 95, onTimeDelivery: 92, qualityScore: 4.8 },
  { id: '2', name: 'Pacific Components', status: 'delayed', reliability: 87, onTimeDelivery: 78, qualityScore: 4.2 },
  { id: '3', name: 'Euro Manufacturing', status: 'active', reliability: 98, onTimeDelivery: 96, qualityScore: 4.9 },
  { id: '4', name: 'Asia Parts Ltd', status: 'issues', reliability: 72, onTimeDelivery: 65, qualityScore: 3.8 }
];

const SupplierTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      delayed: 'bg-yellow-100 text-yellow-800',
      issues: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reliability</TableHead>
            <TableHead>On-Time</TableHead>
            <TableHead>Quality</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSuppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(supplier.status)}>
                  {supplier.status}
                </Badge>
              </TableCell>
              <TableCell>{supplier.reliability}%</TableCell>
              <TableCell>{supplier.onTimeDelivery}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {renderStars(supplier.qualityScore)}
                  <span className="ml-1 text-sm">{supplier.qualityScore}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierTable;