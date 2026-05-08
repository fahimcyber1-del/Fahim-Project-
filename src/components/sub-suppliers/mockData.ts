import { SubSupplierRecord } from './types';

export const INITIAL_SUPPLIERS: SubSupplierRecord[] = [
  {
    id: 'SUP-1011',
    name: 'Global Fabrics Ltd.',
    email: 'contact@globalfabrics.com',
    phone: '+1 555-0100',
    contactPerson: 'David Chen',
    country: 'Taiwan',
    category: 'Fabric',
    rating: 4.8,
    status: 'Active',
    riskLevel: 'Low',
    certifications: [
      { id: '1', name: 'Oeko-Tex Standard 100', validUntil: '2024-12-31' },
      { id: '2', name: 'GOTS', validUntil: '2024-10-15' }
    ],
    address: '123 Textile Ave, Taipei, Taiwan',
    website: 'https://globalfabrics.example.com',
    notes: 'Premium supplier for organic cotton blends. Consistent quality.',
    joinDate: '2020-03-15',
    orders: [
      { orderId: 'ORD-2023-001', styleNo: 'ST-A100', quantity: 5000, status: 'Completed', deliveryDate: '2023-05-10' },
      { orderId: 'ORD-2023-045', styleNo: 'ST-B200', quantity: 12000, status: 'In Progress', deliveryDate: '2023-11-20' },
      { orderId: 'ORD-2024-012', styleNo: 'ST-C300', quantity: 8000, status: 'In Progress', deliveryDate: '2024-02-15' }
    ]
  },
  {
    id: 'SUP-1012',
    name: 'Apex Accessories & Trims',
    email: 'info@apextrims.net',
    phone: '+44 20-7946-0958',
    contactPerson: 'Sarah Jenkins',
    country: 'United Kingdom',
    category: 'Trims & Accessories',
    rating: 4.2,
    status: 'Active',
    riskLevel: 'Medium',
    certifications: [
      { id: '1', name: 'ISO 9001:2015', validUntil: '2023-08-22' }
    ],
    address: '45 Industrial Park, London, UK',
    notes: 'Delays occasionally in high season.',
    joinDate: '2021-06-10',
    orders: [
      { orderId: 'ORD-2023-089', styleNo: 'TR-Z99', quantity: 150000, status: 'Completed', deliveryDate: '2023-09-01' },
      { orderId: 'ORD-2024-005', styleNo: 'TR-X88', quantity: 50000, status: 'Delayed', deliveryDate: '2024-01-10' }
    ]
  },
  {
    id: 'SUP-1013',
    name: 'EcoPack Solutions',
    email: 'sales@ecopack.co',
    phone: '+86 21-5555-0011',
    contactPerson: 'Wei Lin',
    country: 'China',
    category: 'Packaging',
    rating: 3.5,
    status: 'Pending Approval',
    riskLevel: 'High',
    certifications: [],
    address: 'Building 5, Packaging District, Shanghai, China',
    website: 'https://ecopack-solutions.example.com',
    notes: 'New supplier. Pending initial bulk quality check.',
    joinDate: '2023-11-20',
    orders: []
  }
];
