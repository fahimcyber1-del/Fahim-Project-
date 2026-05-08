export interface TestParameter {
  name: string;
  requirement: string;
  actualResult: string;
  instrumentId: string;
  status: 'MEETS' | 'FAILS' | 'PENDING';
}

export interface TestRequest {
  id: string; // e.g., #TR-88210
  date: string;
  buyer: string;
  testCategory: string; // primary test category for list
  technician: string;
  technicianInitials: string;
  status: 'COMPLETED' | 'FAILED' | 'IN-PROGRESS' | 'PENDING';

  // Sample Details / PO Integration
  poArticleNumber: string;
  orderQuantity: string;
  color: string;
  size: string;

  // 01 Sample Details
  materialType: string;
  colorCodeRef: string;
  batchId: string;
  sampleOrigin: string;
  supplierReference: string;

  // 02 Test Selection
  selectedTests: string[];

  // 03 Attachments
  attachments: string[];

  // 04 Priority & Deadline
  priorityLevel: 'Standard' | 'Urgent' | 'Critical';
  requiredCompletionDate: string;
  internalRemarks: string;

  // Details Results
  testName: string;
  standard: string;
  labId: string;
  overallResult: 'PASS' | 'FAIL' | 'PENDING';
  turnaroundTime: string;
  complianceScore: string;
  
  parameters: TestParameter[];

  specimenImages: {
    preTest: string;
    postTest: string;
  };

  approval: {
    leadTechnician: string;
    leadTechnicianId: string;
    leadTechnicianDate: string;
    labManager: string;
    labManagerId: string;
    labManagerDate: string;
  };

  inspectorRemarks: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
