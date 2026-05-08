export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintCategory = 'Quality' | 'Delivery' | 'Service' | 'Packaging' | 'Other';

export interface ComplaintAttachment {
  name: string;
  type: string;
  data: string;
}

export interface CustomerComplaintRecord {
  id: string;
  dateReceived: string;
  customerName: string;
  orderRef: string;
  styleNo: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  attachments?: ComplaintAttachment[];
  assignedTo?: string;
  dateResolved?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
