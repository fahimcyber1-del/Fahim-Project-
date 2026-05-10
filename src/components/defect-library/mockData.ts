import { DefectItem } from './types';

export const INITIAL_DEFECTS: DefectItem[] = [
  {
    id: 'DEF-001',
    code: 'ST-102',
    name: 'Broken Stitching',
    category: 'Stitching',
    severity: 'Critical',
    status: 'Active',
    impactedDepartments: ['Sewing', 'Finishing'],
    qualityStandardRef: 'ASTM-D3990',
    sopLink: 'https://internal.wiki/sop/st-102',
    acceptanceCriteria: 'Continuous thread path, uniform tension, no skipped stitches allowed on critical load-bearing seams.',
    rootCauseAnalysis: [
      { step: 1, description: 'Check needle for burrs or damage.' },
      { step: 2, description: 'Verify thread tension settings.' },
      { step: 3, description: 'Check machine timing synchronization.' }
    ],
    correctiveAction: 'Remove broken thread. Re-stitch extending 2 inches beyond break points on both ends.',
    preventiveAction: 'Daily needle changes and routine tension checks every 4 hours.',
    revisionNumber: 'v2.4',
    passReferenceImages: ['https://images.unsplash.com/photo-1588147570417-7cdb224151fb?auto=format&fit=crop&q=80&w=400'],
    failCriteriaImages: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400'],
    lastUpdatedBy: 'Sarah Connor',
    lastUpdatedDate: '2 hours ago',
    createdBy: 'System',
    createdAt: '2023-04-05 11:00',
  },
  {
    id: 'DEF-002',
    code: 'FB-401',
    name: 'Slub in Fabric',
    category: 'Fabric',
    severity: 'Major',
    status: 'Active',
    impactedDepartments: ['Cutting'],
    qualityStandardRef: 'ISO-9001',
    acceptanceCriteria: 'Fabric surface should be generally uniform. Minor slubs acceptable if not visually distracting.',
    preventiveAction: 'Communicate acceptable limit to fabric mill.',
    revisionNumber: 'v1.1',
    lastUpdatedBy: 'Michael T.',
    lastUpdatedDate: '1 day ago'
  },
  {
    id: 'DEF-003',
    code: 'MS-205',
    name: 'Under Tolerance - Chest',
    category: 'Measurement',
    severity: 'Critical',
    status: 'Draft',
    impactedDepartments: ['Sewing', 'Finishing'],
    lastUpdatedBy: 'Alex J.',
    lastUpdatedDate: '5 hours ago'
  },
  {
    id: 'DEF-004',
    code: 'FN-912',
    name: 'Loose Thread Ends',
    category: 'Finishing',
    severity: 'Minor',
    status: 'Active',
    impactedDepartments: ['Finishing'],
    lastUpdatedBy: 'Sarah Connor',
    lastUpdatedDate: '2 days ago'
  }
];
