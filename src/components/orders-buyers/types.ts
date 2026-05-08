export interface Buyer {
  id: string;
  name: string;
  logo?: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  merchandiserName?: string;
  totalOrders: number;
}

export interface SizeColorBreakdown {
  id: string;
  color: string;
  size: string;
  quantity: number;
}

export interface PoArticleInfo {
  id: string;
  poArticleNumber: string;
  breakdowns: SizeColorBreakdown[];
}

export interface BOMEntry {
  id: string;
  category: string;
  itemDescription: string;
  supplierName: string;
  consumption: number;
  uom: string;
  unitPrice: number;
  totalCost: number;
  image?: string;
}

export interface Order {
  id: string;
  poArticleNumber: string;
  buyerId: string;
  buyerName: string;
  styleNumber: string;
  orderDate: string;
  deliveryDate: string;
  quantity: number;
  itemName?: string;
  unitPrice: number;
  totalAmount: number;
  status: 'Pending' | 'In Production' | 'Completed' | 'Shipped' | 'Cancelled';
  merchandiserName?: string;
  timelineStatus?: string;
  productImage?: string;
  buyerTechPack?: string;
  buyerTechPackName?: string;
  productItemDetail?: string;
  shipmentMode?: string;
  vesselFlightNo?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  poDetails?: PoArticleInfo[];
  bomEntries?: BOMEntry[];
  hasWashing?: boolean;
  washingInstructions?: string;
  accessoriesItemName?: string;
  accessoriesInhouseDate?: string;
  cuttingQuantity?: number;
  cuttingStartDate?: string;
  cuttingEndDate?: string;
  sewingInputQuantity?: number;
  sewingCompleteQuantity?: number;
  sewingStartDate?: string;
  sewingEndDate?: string;
  washingQuantitySend?: number;
  washingQuantityReceive?: number;
  washingSendDate?: string;
  washingReceiveDate?: string;
  washingSendAddress?: string;
  finishingInputQuantity?: number;
  finishingCompleteQuantity?: number;
  finishingStartDate?: string;
  finishingEndDate?: string;
  packingQuantity?: number;
}
