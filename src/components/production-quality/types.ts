export interface DefectType {
  type: string;
  count: number;
}

export interface QualityRecord {
  id: string;
  date: string;
  section: string;
  unit: string;
  line: string;
  shift: string;
  style: string;
  buyer: string;
  color: string;
  size: string;
  inspectedQuantity: number;
  passedQuantity: number;
  defectedQuantity: number;
  reworkedQuantity: number;
  rejectedQuantity: number;
  status: 'Passed' | 'Rework' | 'Rejected';
  inspector: string;
  remarks: string;
  topDefects: DefectType[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'summary' }
  | { type: 'manage' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
