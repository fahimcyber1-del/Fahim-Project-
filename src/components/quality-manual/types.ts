export type ManualStatus = 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';

export interface ManualAttachment {
  name: string;
  type: string;
  data: string;
}

export interface ManualVersion {
  version: string;
  dateModified: string;
  modifiedBy: string;
  changes: string;
}

export interface QualityManualRecord {
  id: string; // e.g., QM-2024
  title: string;
  chapter: string;
  version: string;
  status: ManualStatus;
  author: string;
  reviewer: string;
  approver: string;
  dateCreated: string;
  dateLastModified: string;
  datePublished?: string;
  purpose: string;
  content: string;
  attachments?: ManualAttachment[];
  versionHistory?: ManualVersion[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
