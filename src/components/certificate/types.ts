export interface CertificateRecord {
  id: string;
  title: string;
  issuer: string;
  type: 'PRODUCT' | 'SYSTEM' | 'MATERIAL' | 'COMPLIANCE';
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING';
  issueDate: string;
  expiryDate: string;
  referenceNumber: string;
  scope?: string;
  documentUrl?: string; // or an image/pdf url
  lastAuditDate?: string;
  remarks?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
