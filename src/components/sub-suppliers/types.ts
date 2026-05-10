export type SupplierStatus = 'Active' | 'Inactive' | 'Pending Approval' | 'Blacklisted';
export type SupplierRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type SupplierCategory = string; // e.g. 'Fabric' | 'Trims & Accessories' | 'Packaging' | 'Chemicals' | 'Service' | 'Other'

export interface SupplierCertification {
  id: string;
  name: string;
  validUntil: string;
  pdfUrl?: string; 
}

export interface SubSupplierRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  country: string;
  category: SupplierCategory;
  rating: number; 
  status: SupplierStatus;
  riskLevel: SupplierRiskLevel;
  certifications: SupplierCertification[];
  address: string;
  website?: string;
  notes?: string;
  joinDate: string;
  orders?: any[];
  logoUrl?: string;
  documentCode?: string;
  createdBy?: string;
  createdAt?: string;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'manage-categories' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
