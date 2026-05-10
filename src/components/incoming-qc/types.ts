export type QCCategory = 'Fabric' | 'Accessories';

export interface FabricDetails {
  fourPointInspection: string;
  shrinkageTest: string;
  shadebandCheck: string;
  csvCheck: string;
  moistureCheck: string;
}

export interface AccessoriesDetails {
  itemName: string;
  style: string;
  quantity: number;
  inspectedQuantity: number;
  percentageOptions: string;
}

export interface IncomingQCAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface QualitySignature {
  id: string;
  name: string;
  designation: string;
  date: string;
  image?: string;
}

export interface IncomingQCRecord {
  id: string;
  date: string;
  category: QCCategory;
  supplier: string;
  poNumber: string;
  inspectorName: string;
  status: 'Pending' | 'Passed' | 'Failed' | 'On Hold' | 'Partial Pass';
  defectType?: string;
  attachments?: IncomingQCAttachment[];
  fabricDetails?: FabricDetails;
  accessoriesDetails?: AccessoriesDetails;
  notes?: string;
  style?: string; // High level filter
  documentCode?: string;
  signatures?: QualitySignature[];
}
