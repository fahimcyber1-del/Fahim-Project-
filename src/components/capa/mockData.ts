import { CapaRecord } from './types';

export const INITIAL_CAPAS: CapaRecord[] = [
  {
    id: 'CAPA-2024-001',
    dateRaised: '2024-10-15',
    title: 'High Fabric Defect Rate in Batch #A102',
    source: 'Inspection',
    sourceReference: 'INSP-4392',
    severity: 'High',
    status: 'In Progress',
    problemDescription: 'Inspection of incoming fabric revealed a 5% defect rate due to oil stains, which exceeds the acceptable 2% AQL.',
    immediateAction: 'Quarantined the entire batch #A102. Contacted supplier for replacement.',
    rootCauseAnalysis: 'Supplier reported a leaking oil seal in one of their weaving machines which went unnoticed for 2 shifts.',
    correctiveAction: 'Supplier to replace the defective fabric batch. Supplier is implementing a daily machine maintenance checklist.',
    preventiveAction: 'Update incoming QA procedure to sample 20% more rolls from this supplier for the next 3 months.',
    assignedTo: 'Mike Ross',
    targetDate: '2024-11-15',
    attachments: []
  },
  {
    id: 'CAPA-2024-002',
    dateRaised: '2024-09-20',
    title: 'Missing Safety Guards on Sewing Machines',
    source: 'Audit',
    sourceReference: 'AUD-2024-09',
    severity: 'Critical',
    status: 'Closed',
    problemDescription: 'During the ISO 45001 safety audit, 5 sewing machines in Line C were found without safety needle guards.',
    immediateAction: 'Stopped work on the affected machines immediately until guards were installed.',
    rootCauseAnalysis: 'Operators removed them because they claimed it slowed down their work. Supervisors failed to enforce safety policies.',
    correctiveAction: 'Re-installed all missing safety guards. Issued warning letters to supervisors of Line C.',
    preventiveAction: 'Conducted a factory-wide safety training emphasizing the importance of needle guards. Incorporated guard checks into daily morning supervisor rounds.',
    assignedTo: 'Sarah Lee',
    targetDate: '2024-09-30',
    closureDate: '2024-09-28',
    attachments: []
  },
  {
    id: 'CAPA-2024-003',
    dateRaised: '2024-10-25',
    title: 'Late Delivery of Trims',
    source: 'Supplier',
    sourceReference: 'PO-9912',
    severity: 'Medium',
    status: 'Open',
    problemDescription: 'Zippers from Supplier XYZ arrived 4 days late, causing a delay in the production line.',
    assignedTo: 'Amanda Chen',
    targetDate: '2024-11-05',
    attachments: []
  }
];
