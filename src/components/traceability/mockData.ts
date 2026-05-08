import { TraceabilityRecord } from './types';

export const mockTraceabilityRecords: TraceabilityRecord[] = [
  {
    id: 'TRC-2023-001',
    productBatchNo: 'GAR-W9901',
    type: 'GARMENT',
    status: 'VERIFIED',
    date: '2023-11-01',
    certifications: ['GOTS', 'OEKO-TEX'],
    supplierName: 'In-House Garment Div',
    originCountry: 'Bangladesh',
    notes: 'Full organic cotton traceability confirmed for H&M order.',
    stages: [
      {
        id: 'STG-001',
        stageName: 'Spinning',
        facility: 'SpinCo Mills',
        dateCompleted: '2023-09-10',
        inputBatchNo: 'RAW-ORG-01',
        outputBatchNo: 'YRN-ORG-112',
        verified: true
      },
      {
        id: 'STG-002',
        stageName: 'Knitting',
        facility: 'Knit & Weave Ltd.',
        dateCompleted: '2023-09-25',
        inputBatchNo: 'YRN-ORG-112',
        outputBatchNo: 'FAB-ORG-442',
        verified: true
      },
      {
        id: 'STG-003',
        stageName: 'Dyeing',
        facility: 'ColorTex Processing',
        dateCompleted: '2023-10-05',
        inputBatchNo: 'FAB-ORG-442',
        outputBatchNo: 'DYD-ORG-88',
        verified: true
      },
      {
        id: 'STG-004',
        stageName: 'Garment Making',
        facility: 'Unit 4 Cutting & Sewing',
        dateCompleted: '2023-10-30',
        inputBatchNo: 'DYD-ORG-88',
        outputBatchNo: 'GAR-W9901',
        verified: true
      }
    ]
  },
  {
    id: 'TRC-2023-002',
    productBatchNo: 'FAB-GRS-202',
    type: 'FABRIC',
    status: 'IN_PROGRESS',
    date: '2023-11-20',
    certifications: ['GRS'],
    supplierName: 'EcoTextiles Inc.',
    originCountry: 'India',
    stages: [
      {
        id: 'STG-005',
        stageName: 'Recycling/Spinning',
        facility: 'EcoTextiles Spin Unit',
        dateCompleted: '2023-11-10',
        outputBatchNo: 'YRN-REC-55',
        verified: true
      },
      {
        id: 'STG-006',
        stageName: 'Weaving',
        facility: 'EcoTextiles Loom',
        dateCompleted: '2023-11-18',
        inputBatchNo: 'YRN-REC-55',
        outputBatchNo: 'FAB-GRS-202',
        verified: false
      }
    ]
  },
  {
    id: 'TRC-2023-003',
    productBatchNo: 'YRN-B22-44',
    type: 'YARN',
    status: 'FAILED',
    date: '2023-10-15',
    certifications: ['OCS'],
    supplierName: 'Global Yarns',
    originCountry: 'Vietnam',
    notes: 'Failed to provide valid transaction certificates.',
    stages: [
      {
        id: 'STG-007',
        stageName: 'Spinning',
        facility: 'Global Yarns Mill 1',
        dateCompleted: '2023-10-10',
        outputBatchNo: 'YRN-B22-44',
        verified: false
      }
    ]
  }
];
