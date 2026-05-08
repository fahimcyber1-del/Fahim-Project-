export type CapaStatus = 'Open' | 'In Investigation' | 'Action Planned' | 'In Progress' | 'Under Review' | 'Closed';

export const getStatusProgress = (status: CapaStatus): number => {
  switch (status) {
    case 'Open': return 0;
    case 'In Investigation': return 20;
    case 'Action Planned': return 40;
    case 'In Progress': return 60;
    case 'Under Review': return 80;
    case 'Closed': return 100;
    default: return 0;
  }
};

export type CapaSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type CapaSource = 'Audit' | 'Inspection' | 'Customer Complaint' | 'Internal Process' | 'Supplier' | 'Other';

export interface CapaAttachment {
  name: string;
  type: string;
  data: string;
  step?: 'Problem' | 'Root Cause' | 'Corrective Action' | 'Preventive Action' | 'General';
}

export interface CapaRecord {
  id: string;
  dateRaised: string;
  title: string;
  source: CapaSource;
  sourceReference?: string; // e.g. Audit ID, Complaint ID
  severity: CapaSeverity;
  status: CapaStatus;
  
  // Problem
  problemDescription: string;
  immediateAction?: string;
  
  // Investigation
  rootCauseAnalysis?: string;
  
  // Actions
  correctiveAction?: string;
  preventiveAction?: string;
  
  // Tracking
  assignedTo: string;
  targetDate: string;
  closureDate?: string;
  
  attachments?: CapaAttachment[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
