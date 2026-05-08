import { IncomingQCRecord } from './types';

export const mockIncomingQC: IncomingQCRecord[] = [
  {
    id: 'IQC-2026-001',
    date: '2026-05-01',
    category: 'Fabric',
    supplier: 'TexWorld Inc',
    poNumber: 'PO-99120',
    inspectorName: 'John Doe',
    status: 'Passed',
    style: 'S-Summer26',
    fabricDetails: {
      fourPointInspection: 'Score 15 - Acceptable',
      shrinkageTest: 'Warp: -2%, Weft: -1.5%',
      shadebandCheck: 'Matched A grade',
      csvCheck: 'Passed',
      moistureCheck: '7.5% - Normal'
    },
    notes: 'Good quality batch',
    attachments: [
      { id: '1', name: 'inspection_report.pdf', url: '#', type: 'application/pdf' },
      { id: '2', name: 'fabric_sample.jpg', url: '#', type: 'image/jpeg' }
    ]
  },
  {
    id: 'IQC-2026-002',
    date: '2026-05-02',
    category: 'Accessories',
    supplier: 'ZipFasteners Corp',
    poNumber: 'PO-99121',
    inspectorName: 'Jane Smith',
    status: 'Failed',
    defectType: 'Mechanical Failure',
    style: 'S-Winter26',
    accessoriesDetails: {
      itemName: 'Nylon Zipper 5"',
      style: 'S-Winter26',
      quantity: 5000,
      inspectedQuantity: 500,
      percentageOptions: '10%'
    },
    notes: 'Sliders getting stuck on 5% of items.',
    attachments: [
      { id: '3', name: 'zipper_issue.jpg', url: '#', type: 'image/jpeg' }
    ]
  },
  {
    id: 'IQC-2026-003',
    date: '2026-05-03',
    category: 'Fabric',
    supplier: 'WeaveMasters LLC',
    poNumber: 'PO-99123',
    inspectorName: 'Mike Johnson',
    status: 'Pending',
    style: 'S-Autumn26',
    fabricDetails: {
      fourPointInspection: 'Pending',
      shrinkageTest: 'Pending',
      shadebandCheck: 'Pending',
      csvCheck: 'Pending',
      moistureCheck: 'Pending'
    },
    notes: 'Awaiting lab results for shrinkage test.',
    attachments: []
  },
  {
    id: 'IQC-2026-004',
    date: '2026-05-04',
    category: 'Accessories',
    supplier: 'ButtonWorks Ltd',
    poNumber: 'PO-99124',
    inspectorName: 'Alice Green',
    status: 'Partial Pass',
    defectType: 'Color Mismatch',
    style: 'S-Autumn26',
    accessoriesDetails: {
      itemName: 'Plastic Buttons 15mm',
      style: 'S-Autumn26',
      quantity: 10000,
      inspectedQuantity: 1000,
      percentageOptions: '10%'
    },
    notes: 'Batch 1 is perfect. Batch 2 shows slight color deviation from standard.',
    attachments: [
      { id: '4', name: 'color_comparison.pdf', url: '#', type: 'application/pdf' },
      { id: '5', name: 'batch2_sample.jpg', url: '#', type: 'image/jpeg' }
    ]
  },
  {
    id: 'IQC-2026-005',
    date: '2026-05-05',
    category: 'Fabric',
    supplier: 'EcoTextiles',
    poNumber: 'PO-99125',
    inspectorName: 'Mike Johnson',
    status: 'On Hold',
    defectType: 'Weaving Defect',
    style: 'S-Spring27',
    fabricDetails: {
      fourPointInspection: 'Score 45 - Unacceptable',
      shrinkageTest: 'Warp: -1%, Weft: -1%',
      shadebandCheck: 'Matched A grade',
      csvCheck: 'Passed',
      moistureCheck: '7.8% - Normal'
    },
    notes: 'Excessive slubs found continuously across multiple rolls. Need buyer approval before rejecting completely.',
    attachments: [
      { id: '6', name: 'slubs_close_up.png', url: '#', type: 'image/png' },
      { id: '7', name: 'four_point_sheet.xlsx', url: '#', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ]
  }
];
