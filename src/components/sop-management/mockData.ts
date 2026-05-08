import { SOPRecord } from './types';

export const INITIAL_SOPS: SOPRecord[] = [
  {
    id: 'SOP-PRD-001',
    title: 'Garment Sewing Procedure',
    department: 'Production',
    version: '2.1',
    status: 'Published',
    author: 'John Doe',
    reviewer: 'Jane Smith',
    approver: 'Mike Johnson',
    dateCreated: '2023-02-10',
    dateLastModified: '2023-08-15',
    datePublished: '2023-08-20',
    purpose: 'Standardize the sewing process for basic t-shirts to ensure consistent quality.',
    scope: 'All sewing line operators working on basic t-shirt models.',
    procedureSteps: '1. Prepare workstation with correct threads.\n2. Align side seams.\n3. Sew with a consistent 1/4 inch allowance.\n4. Check for dropped stitches.',
    attachments: [],
    versionHistory: [
      {
        version: '2.1',
        dateModified: '2023-08-15',
        modifiedBy: 'John Doe',
        changes: 'Updated stitch allowance recommendations.'
      },
      {
        version: '2.0',
        dateModified: '2023-02-10',
        modifiedBy: 'John Doe',
        changes: 'Initial creation.'
      }
    ]
  },
  {
    id: 'SOP-QLT-005',
    title: 'AQL Inspection Guidelines',
    department: 'Quality',
    version: '1.0',
    status: 'Under Review',
    author: 'Alice QA',
    reviewer: 'Bob QA Manager',
    approver: '',
    dateCreated: '2024-01-05',
    dateLastModified: '2024-01-15',
    purpose: 'Define the Acceptable Quality Limit sampling process.',
    scope: 'Final inspection team.',
    procedureSteps: '1. Determine lot size.\n2. Select sampling plan.\n3. Inspect samples randomly.\n4. Document pass/fail criteria.',
    attachments: [],
    versionHistory: [
      {
        version: '1.0',
        dateModified: '2024-01-05',
        modifiedBy: 'Alice QA',
        changes: 'Draft created.'
      }
    ]
  }
];
