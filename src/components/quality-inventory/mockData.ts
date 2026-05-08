import { InventoryItem, InventoryTransaction } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-2026-001',
    itemName: 'A4 Printer Paper (Ream)',
    category: 'Stationery',
    currentStock: 45,
    unit: 'reams',
    location: 'Supply Closet A',
    reorderLevel: 20,
    notes: 'Standard 80gsm white paper'
  },
  {
    id: 'INV-2026-002',
    itemName: 'Epson Printer Toner (Black)',
    category: 'Consumables',
    currentStock: 5,
    unit: 'pcs',
    location: 'IT Storage',
    reorderLevel: 10,
    notes: 'For main office printer'
  },
  {
    id: 'INV-2026-003',
    itemName: 'Ballpoint Pens (Box of 50)',
    category: 'Stationery',
    currentStock: 12,
    unit: 'boxes',
    location: 'Supply Closet A',
    reorderLevel: 5,
  },
  {
    id: 'INV-2026-004',
    itemName: 'Packing Tape (Clear)',
    category: 'Packaging',
    currentStock: 120,
    unit: 'rolls',
    location: 'Warehouse Loading Dock',
    reorderLevel: 50,
  }
];

export const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: 'TXN-1001',
    itemId: 'INV-2026-001',
    itemNameSnapshot: 'A4 Printer Paper (Ream)',
    type: 'Entry',
    quantity: 50,
    date: '2026-05-01',
    reference: 'OfficeMax Supplier',
    notes: 'Monthly bulk order'
  },
  {
    id: 'TXN-1002',
    itemId: 'INV-2026-002',
    itemNameSnapshot: 'Epson Printer Toner (Black)',
    type: 'Issue',
    quantity: 2,
    date: '2026-05-02',
    reference: 'HR Department',
    notes: 'Requested by Jane'
  }
];
