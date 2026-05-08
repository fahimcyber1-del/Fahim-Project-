import { Buyer, Order } from './types';

export const INITIAL_BUYERS: Buyer[] = [
  {
    id: 'B-001',
    name: 'H&M',
    country: 'Sweden',
    contactPerson: 'Lars Svensson',
    email: 'lars.svensson@hm.com',
    phone: '+46-70-1234567',
    status: 'Active',
    totalOrders: 25,
    merchandiserName: 'Alex Carter'
  },
  {
    id: 'B-002',
    name: 'Zara',
    country: 'Spain',
    contactPerson: 'Maria Garcia',
    email: 'mgarcia@zara.com',
    phone: '+34-600-123456',
    status: 'Active',
    totalOrders: 42,
    merchandiserName: 'Sarah Smith'
  },
  {
    id: 'B-003',
    name: 'Nordstrom',
    country: 'USA',
    contactPerson: 'John Smith',
    email: 'john.smith@nordstrom.com',
    phone: '+1-206-555-0123',
    status: 'Active',
    totalOrders: 15,
    merchandiserName: 'Emily Chen'
  },
  {
    id: 'B-004',
    name: 'Mango',
    country: 'Spain',
    contactPerson: 'Elena Rodriguez',
    email: 'elena.r@mango.com',
    phone: '+34-600-987654',
    status: 'Inactive',
    totalOrders: 8,
    merchandiserName: 'David Lee'
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    poArticleNumber: 'PO-98231',
    buyerId: 'B-001',
    buyerName: 'H&M',
    styleNumber: 'TS-Basic-Crew',
    orderDate: '2024-04-10',
    deliveryDate: '2024-05-15',
    quantity: 10000,
    unitPrice: 5.50,
    totalAmount: 55000,
    status: 'In Production',
    poDetails: [
      {
        id: 'PD-001',
        poArticleNumber: 'PO-98231',
        breakdowns: [
          { id: 'BD-001', color: 'Navy', size: 'M', quantity: 5000 },
          { id: 'BD-002', color: 'Navy', size: 'L', quantity: 5000 }
        ]
      }
    ]
  },
  {
    id: 'ORD-2024-002',
    poArticleNumber: 'PO-33492',
    buyerId: 'B-002',
    buyerName: 'Zara',
    styleNumber: 'JN-Denim-Slim',
    orderDate: '2024-04-15',
    deliveryDate: '2024-05-20',
    quantity: 5000,
    unitPrice: 15.00,
    totalAmount: 75000,
    status: 'Pending',
    merchandiserName: 'Sarah Smith',
    timelineStatus: 'Material Sourcing',
    productItemDetail: 'Slim fit denim jeans. 98% cotton, 2% elastane. Color: Navy Blue wash.'
  },
  {
    id: 'ORD-2024-003',
    poArticleNumber: 'PO-55102',
    buyerId: 'B-003',
    buyerName: 'Nordstrom',
    styleNumber: 'JK-Winter-Puffer',
    orderDate: '2024-03-20',
    deliveryDate: '2024-05-10',
    quantity: 2000,
    unitPrice: 45.00,
    totalAmount: 90000,
    status: 'Completed',
    merchandiserName: 'Emily Chen',
    timelineStatus: 'Shipped to Warehouse',
    productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80',
    buyerTechPack: 'Nordstrom_Winter_Puffer.pdf',
    productItemDetail: 'Winter puffer jacket with waterproof outershell and faux down insulation. Color: Olive Green.'
  },
  {
    id: 'ORD-2024-004',
    poArticleNumber: 'PO-98232',
    buyerId: 'B-001',
    buyerName: 'H&M',
    styleNumber: 'TS-Premium-V',
    orderDate: '2024-04-12',
    deliveryDate: '2024-05-25',
    quantity: 8000,
    unitPrice: 7.00,
    totalAmount: 56000,
    status: 'In Production',
  },
  {
    id: 'ORD-2024-005',
    poArticleNumber: 'PO-77421',
    buyerId: 'B-004',
    buyerName: 'Mango',
    styleNumber: 'DR-Summer-Floral',
    orderDate: '2024-02-15',
    deliveryDate: '2024-04-05',
    quantity: 3000,
    unitPrice: 22.00,
    totalAmount: 66000,
    status: 'Shipped',
  },
];
