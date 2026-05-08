import { ProcessFlowRecord } from './types';

export const INITIAL_FLOWS: ProcessFlowRecord[] = [
  {
    id: 'FLOW-QA-001',
    title: 'Quality Inspection Process',
    department: 'Quality Assurance',
    version: '1.2',
    status: 'Published',
    author: 'QA Manager',
    dateCreated: '2023-08-15',
    dateLastModified: '2024-01-20',
    description: 'Standard procedure for quality inspection of incoming raw materials.',
    nodes: [
      { id: '1', type: 'start', label: 'Material Arrival', nextNodes: ['2'] },
      { id: '2', type: 'process', label: 'Initial Check', description: 'Visual inspection of packaging and labels.', nextNodes: ['3'], dependencies: ['1'] },
      { id: '3', type: 'decision', label: 'Damage Found?', nextNodes: ['4', '5'], dependencies: ['2'] },
      { id: '4', type: 'process', label: 'Reject & Return', description: 'Log rejection and notify supplier.', nextNodes: ['6'], dependencies: ['3'] },
      { id: '5', type: 'process', label: 'Lab Testing', description: 'Take samples to lab for chemical analysis.', nextNodes: ['7'], dependencies: ['3'] },
      { id: '6', type: 'end', label: 'Process End (Rejected)', nextNodes: [], dependencies: ['4'] },
      { id: '7', type: 'document', label: 'Inspection Report', description: 'Generate and file the QA report.', nextNodes: ['8'], dependencies: ['5'] },
      { id: '8', type: 'end', label: 'Process End (Accepted)', nextNodes: [], dependencies: ['7'] }
    ]
  },
  {
    id: 'FLOW-HR-002',
    title: 'Employee Onboarding Flow',
    department: 'Human Resources',
    version: '2.0',
    status: 'Under Review',
    author: 'HR Lead',
    dateCreated: '2024-03-10',
    dateLastModified: '2024-03-12',
    description: 'Steps required for onboarding a new employee on their first day.',
    nodes: [
      { id: '1', type: 'start', label: 'Welcome Session', nextNodes: ['2'] },
      { id: '2', type: 'process', label: 'IT Setup', description: 'Provide laptop, accounts, and access cards.', nextNodes: ['3'] },
      { id: '3', type: 'document', label: 'Sign Contracts', description: 'NDA and employment agreement signatures.', nextNodes: ['4'] },
      { id: '4', type: 'process', label: 'Manager Intro', description: 'Meeting with the direct line manager.', nextNodes: ['5'] },
      { id: '5', type: 'end', label: 'Onboarding Complete', nextNodes: [] },
    ]
  }
];
