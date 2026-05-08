export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  unit: string;
  location: string;
  reorderLevel: number;
  notes?: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemNameSnapshot: string;
  type: 'Entry' | 'Issue';
  quantity: number;
  date: string;
  reference: string;
  notes?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; initialData?: InventoryItem }
  | { type: 'transaction'; itemId: string; txType: 'Entry' | 'Issue' }
  | { type: 'tx_history' };
