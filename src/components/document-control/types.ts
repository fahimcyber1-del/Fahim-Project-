export type DocumentCategory = 'Policy' | 'Procedure' | 'SOP' | 'Form' | 'Manual' | 'Guideline' | 'Other';
export type DocumentStatus = 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Archived' | 'Obsolete';

export interface DocumentAttachment {
  name: string;
  type: string;
  data: string; // Base64 usually or URL
}

export interface DocumentVersion {
  version: string;
  dateModified: string;
  modifiedBy: string;
  changes: string;
}

export interface DocumentRecord {
  id: string; // Document ID (e.g., DOC-2023-001)
  title: string;
  category: DocumentCategory;
  version: string;
  status: DocumentStatus;
  author: string;
  reviewer: string;
  approver: string;
  publisher: string;
  dateCreated: string;
  dateLastModified: string;
  datePublished?: string;
  department: string;
  description: string;
  attachments?: DocumentAttachment[];
  versionHistory?: DocumentVersion[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
