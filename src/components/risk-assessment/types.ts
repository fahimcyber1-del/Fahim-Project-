export type RiskCategory = 'Product' | 'Process' | 'Critical Process';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskStatus = 'Draft' | 'Active' | 'Mitigated' | 'Closed';

export interface RiskItem {
  id: string;
  description: string;
  hazardIdentified: string;
  severity: number;
  likelihood: number;
  riskScore: number;
  riskLevel: RiskLevel;
  mitigationPlan: string;
  mitigationOwner: string;
  mitigationDueDate: string;
  residualSeverity?: number;
  residualLikelihood?: number;
  residualRiskScore?: number;
  residualRiskLevel?: RiskLevel;
}

export interface RiskProductDetail {
  itemCategory?: string;
  styleNumber: string;
  itemName?: string;
  productImage?: string;
}

export interface RiskAttachment {
  name: string;
  type: string;
  data: string;
}

export interface RiskRecord {
  id: string;
  title: string;
  dateAssessed: string;
  category: RiskCategory;
  
  productDetails?: RiskProductDetail;
  processName?: string;
  
  // Single risk approach (legacy / Process / Critical Process maybe)
  description?: string;
  hazardIdentified?: string;
  severity?: number; // 1-5
  likelihood?: number; // 1-5
  riskScore?: number; // severity * likelihood
  riskLevel?: RiskLevel;
  mitigationPlan?: string;
  mitigationOwner?: string;
  mitigationDueDate?: string;
  residualSeverity?: number;
  residualLikelihood?: number;
  residualRiskScore?: number;
  residualRiskLevel?: RiskLevel;

  // Multiple risks approach (used for Product)
  identifiedRisks?: RiskItem[];

  status: RiskStatus;
  attachments?: RiskAttachment[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string }
  | { type: 'manage' };
