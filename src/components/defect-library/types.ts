export interface DefectItem {
  id: string;
  code: string;
  name: string;
  category: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Active' | 'Draft' | 'Archived';
  impactedDepartments: string[];
  qualityStandardRef?: string;
  sopLink?: string;
  acceptanceCriteria?: string;
  
  rootCauseAnalysis?: { step: number; description: string }[];
  correctiveAction?: string;
  preventiveAction?: string;
  revisionNumber?: string;
  
  passReferenceImages?: string[];
  failCriteriaImages?: string[];
  
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string }
  | { type: 'settings' };
