export interface IsoQuestionTemplate {
  id: string;
  clause: string;
  question: string;
}

export interface IsoQuestion extends IsoQuestionTemplate {
  evaluation: string | null;
  evidence: string;
  image?: string;
}

export interface AuditRecord {
  id: string;
  title: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'SUPPLIER' | 'THIRD_PARTY';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  date: string; // ISO format YYYY-MM-DD
  endDate?: string;
  auditor: string;
  department: string;
  location: string;
  subSupplier?: string;
  score?: number;
  findings: AuditFinding[];
  isoQuestions?: IsoQuestion[];
  remarks?: string;
  attachments?: { name: string; type: string; data: string }[];
  signature?: string;
  signatureImage?: string;
  signatureDesignation?: string;
  signatureDate?: string;
  signatures?: AuditSignature[];
}

export interface AuditSignature {
  id: string;
  name: string;
  designation: string;
  date: string;
  image?: string;
}

export interface AuditFinding {
  id: string;
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  status: 'OPEN' | 'CLOSED';
  correctiveAction?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'calendar' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string }
  | { type: 'manage' };
