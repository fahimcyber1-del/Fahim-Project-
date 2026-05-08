export type ProcedureStatus = 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
export type ProcedureType = 'Standard' | 'Emergency' | 'Administrative' | 'Technical' | 'Safety' | 'Other';

export interface ProcedureAttachment {
  name: string;
  type: string;
  data: string;
}

export interface ProcedureVersion {
  version: string;
  dateModified: string;
  modifiedBy: string;
  changes: string;
}

export interface SubProcessStep {
  id: string;
  stepNumber: number;
  description: string;
  expectedOutcome: string;
}

export interface ProcedureRecord {
  id: string; // e.g., PROC-Safety-001
  title: string;
  type: ProcedureType;
  department: string;
  version: string;
  status: ProcedureStatus;
  author: string;
  reviewer: string;
  approver: string;
  dateCreated: string;
  dateLastModified: string;
  datePublished?: string;
  purpose: string;
  scope: string;
  prerequisites: string;
  steps: string;
  subProcessSteps?: SubProcessStep[];
  attachments?: ProcedureAttachment[];
  versionHistory?: ProcedureVersion[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
