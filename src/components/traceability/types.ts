export interface TraceabilityRecord {
  id: string;
  poNumber?: string;
  styleNumber?: string;
  orderQuantity?: number;
  productImage?: string;
  productBatchNo: string;
  type: 'YARN' | 'FABRIC' | 'GARMENT';
  status: 'VERIFIED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
  date: string;
  certifications?: string[];
  supplierName?: string;
  originCountry?: string;
  notes?: string;
  stages: TraceabilityStage[];
}

export interface TraceabilityStage {
  id: string;
  stageName: string;
  facility: string;
  dateCompleted: string;
  inputBatchNo?: string;
  outputBatchNo?: string;
  verified: boolean;
  documents?: string[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
