import { AuditRecord } from './types';

export const mockAudits: AuditRecord[] = [
  {
    id: 'AUD-2023-001',
    title: 'Q3 Internal Quality Audit',
    type: 'INTERNAL',
    status: 'COMPLETED',
    date: '2023-09-15',
    endDate: '2023-09-16',
    auditor: 'Sarah Jenkins',
    department: 'Dyeing & Finishing',
    location: 'Building B',
    score: 85,
    findings: [
      {
        id: 'FND-001',
        description: 'Calibration records for vat 3 are missing.',
        severity: 'MAJOR',
        status: 'CLOSED',
        correctiveAction: 'Records were located and filed properly.'
      },
      {
        id: 'FND-002',
        description: 'Housekeeping in chemical storage area needs improvement.',
        severity: 'MINOR',
        status: 'OPEN',
        correctiveAction: 'Scheduled deep cleaning and assigned daily checklist.'
      }
    ],
    remarks: 'Overall good compliance, but documentation practices need tightening.'
  },
  {
    id: 'AUD-2023-002',
    title: 'ISO 9001 Surveillance Audit',
    type: 'THIRD_PARTY',
    status: 'PLANNED',
    date: '2023-11-20',
    endDate: '2023-11-22',
    auditor: 'TUV SUD',
    department: 'Facility Wide',
    location: 'Main Campus',
    findings: []
  },
  {
    id: 'AUD-2023-003',
    title: 'Supplier Pre-Assessment: TrimsCo',
    type: 'SUPPLIER',
    status: 'IN_PROGRESS',
    date: '2023-10-05',
    auditor: 'Michael Chen',
    department: 'Procurement',
    location: 'TrimsCo Facility (Remote)',
    subSupplier: 'Apex Accessories & Trims',
    score: 60,
    findings: [
      {
        id: 'FND-003',
        description: 'Material traceability system not fully implemented.',
        severity: 'MAJOR',
        status: 'OPEN'
      }
    ],
    isoQuestions: [
      {
        id: 'q1',
        clause: '4.1',
        question: 'Understanding the organization and its context',
        evaluation: 'OK',
        evidence: 'Company profile reviewed'
      },
      {
        id: 'q2',
        clause: '4.2',
        question: 'Understanding the needs and expectations of interested parties',
        evaluation: 'Minor NC',
        evidence: 'Stakeholder map outdated'
      },
      {
        id: 'q3',
        clause: '8.4',
        question: 'Control of externally provided processes, products and services',
        evaluation: 'Major NC',
        evidence: 'Traceability not fully implemented'
      }
    ]
  },
  {
    id: 'AUD-2023-004',
    title: 'Q4 Safety & Quality Walkthrough',
    type: 'INTERNAL',
    status: 'PLANNED',
    date: '2023-12-01',
    auditor: 'Sarah Jenkins',
    department: 'Cutting',
    location: 'Building A',
    findings: []
  }
];
