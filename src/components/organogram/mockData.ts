import { OrganogramRecord } from './types';

export const INITIAL_ORGANOGRAMS: OrganogramRecord[] = [
  {
    id: 'ORG-CORP-001',
    title: 'Corporate Executive Structure',
    department: 'Executive',
    version: '1.2',
    status: 'Published',
    dateCreated: '2023-01-10',
    dateLastModified: '2024-02-15',
    description: 'The overall executive structure of the company, starting from the CEO down to key department heads.',
    nodes: [
      { id: '1', role: 'Chief Executive Officer (CEO)', name: 'Alice Smith', parentId: null },
      { id: '2', role: 'Chief Operating Officer (COO)', name: 'Bob Johnson', parentId: '1' },
      { id: '3', role: 'Chief Financial Officer (CFO)', name: 'Charlie Davis', parentId: '1' },
      { id: '4', role: 'VP of Engineering', name: 'Diana Evans', parentId: '2' },
      { id: '5', role: 'VP of Sales', name: 'Evan Garcia', parentId: '2' },
      { id: '6', role: 'VP of HR', name: 'Fiona Hill', parentId: '2' },
    ]
  },
  {
    id: 'ORG-PROD-002',
    title: 'Production Floor Hierarchy - Block A',
    department: 'Production',
    version: '2.0',
    status: 'Published',
    dateCreated: '2023-05-12',
    dateLastModified: '2024-03-01',
    description: 'Detailed view of production managers, line supervisors, and team leads for Block A.',
    nodes: [
      { id: '1', role: 'Production Director', name: 'George Ives', parentId: null },
      { id: '2', role: 'Plant Manager', name: 'Hannah Jones', parentId: '1' },
      { id: '3', role: 'Line 1 Supervisor', name: 'Ian King', parentId: '2' },
      { id: '4', role: 'Line 2 Supervisor', name: 'Julia Lee', parentId: '2' },
      { id: '5', role: 'Quality Control Lead', name: 'Kevin Moore', parentId: '2' },
    ]
  },
  {
    id: 'ORG-HR-003',
    title: 'HR Department Structure',
    department: 'HR',
    version: '0.9',
    status: 'Draft',
    dateCreated: '2024-04-10',
    dateLastModified: '2024-04-15',
    description: 'Draft structure mapping showing the planned changes for the upcoming quarter in HR.',
    nodes: [
      { id: '1', role: 'VP of HR', name: 'Fiona Hill', parentId: null },
      { id: '2', role: 'Talent Acquisition Manager', name: 'Liam Nelson', parentId: '1' },
      { id: '3', role: 'Employee Relations Manager', name: 'Mia Oates', parentId: '1' }
    ]
  }
];
