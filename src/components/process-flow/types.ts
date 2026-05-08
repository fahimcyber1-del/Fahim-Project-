export type FlowStatus = 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Archived';
export type NodeType = 'start' | 'process' | 'decision' | 'document' | 'end';

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  nextNodes: string[]; // IDs of the nodes it connects to
  dependencies?: string[]; // IDs of the nodes it depends on
  status?: 'pending' | 'active' | 'completed';
  position?: { x: number; y: number };
}

export interface ProcessFlowRecord {
  id: string;
  title: string;
  department: string;
  version: string;
  status: FlowStatus;
  author: string;
  dateCreated: string;
  dateLastModified: string;
  description: string;
  nodes: FlowNode[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
