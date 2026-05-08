export type InspectionCategory = 'Inline' | 'Prefinal' | 'Final';

export type CheckStatus = 'OK' | 'NOT OK' | 'N/A';

export interface InspectionRecord {
  id: string;
  category: InspectionCategory;
  date: string;
  poNumber: string;
  styleNumber: string;
  articleNumber?: string;
  crdDate: string;
  buyer: string;
  color: string;
  size: string;
  
  aqlLevel?: string;
  inspectionLevel?: string;
  orderQuantity?: number;
  sampleQuantity?: number;
  
  // Checks
  workmanship?: CheckStatus;
  measurement?: CheckStatus;
  productSafety?: CheckStatus;
  labeling?: CheckStatus;
  packing?: CheckStatus;
  shippingMark?: CheckStatus;
  bomCheck?: CheckStatus;

  inspectedQuantity: number;
  criticalDefects: number;
  majorDefects: number;
  minorDefects: number;
  shortage: number;
  excess: number;
  
  inspector: string;
  status: 'Pass' | 'Recheck' | 'Fail';
  remarks?: string;
  attachments?: { name: string; type: string; data: string }[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'summary' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
