export type SOPStatus = 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
export type SOPDepartment = 'Production' | 'Quality' | 'Maintenance' | 'Logistics' | 'HR' | 'Other';

export interface SOPAttachment {
  name: string;
  type: string;
  data: string;
}

export interface SOPVersion {
  version: string;
  dateModified: string;
  modifiedBy: string;
  changes: string;
}

export interface SOPRecord {
  id: string; // e.g., SOP-PRD-001
  title: string;
  department: SOPDepartment;
  version: string;
  status: SOPStatus;
  author: string;
  reviewer: string;
  approver: string;
  dateCreated: string;
  dateLastModified: string;
  datePublished?: string;
  purpose: string;
  scope: string;
  procedureSteps: string;
  attachments?: SOPAttachment[];
  versionHistory?: SOPVersion[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
