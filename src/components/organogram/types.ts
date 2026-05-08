export type OrganogramStatus = 'Draft' | 'Published' | 'Archived';

export interface OrganogramNode {
  id: string; // e.g., '1', '2', etc. used for hierarchy
  role: string;
  name?: string;
  parentId: string | null; // ID of the parent node, or null for root
}

export interface OrganogramRecord {
  id: string; // e.g., ORG-001
  title: string;
  department: string;
  version: string;
  status: OrganogramStatus;
  dateCreated: string;
  dateLastModified: string;
  description: string;
  nodes: OrganogramNode[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
