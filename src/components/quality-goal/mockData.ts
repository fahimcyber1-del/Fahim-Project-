import { QualityGoalRecord } from './types';

export const INITIAL_GOALS: QualityGoalRecord[] = [
  {
    id: 'QG-2025-001',
    title: 'Reduce Fabric Defect Rate',
    category: 'Defect Rate',
    targetValue: 2.0,
    currentValue: 2.8,
    unit: '%',
    status: 'At Risk',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    owner: 'Alex Mercer',
    description: 'Aim to reduce the overall fabric defect rate from the current 3.0% average down to below 2.0% by implementing stricter incoming material inspections and supplier quality improvement plans.',
    milestones: [
      { id: 'm1', title: 'Implement new inspection guidelines', dueDate: '2025-03-15', status: 'Completed' },
      { id: 'm2', title: 'Supplier quality workshop', dueDate: '2025-06-30', status: 'Pending' },
      { id: 'm3', title: 'Achieve 2.5% interim target', dueDate: '2025-09-30', status: 'Pending' }
    ],
    progress: 33
  },
  {
    id: 'QG-2025-002',
    title: 'Maintain Audit Compliance',
    category: 'Compliance',
    targetValue: 100,
    currentValue: 100,
    unit: '%',
    status: 'On Track',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    owner: 'Sarah Lee',
    description: 'Ensure 100% compliance with ISO 9001 and social audits throughout the year.',
    milestones: [
      { id: 'm1', title: 'Internal Q1 Audit', dueDate: '2025-03-31', status: 'Completed' },
      { id: 'm2', title: 'External ISO Recertification', dueDate: '2025-08-15', status: 'Pending' }
    ],
    progress: 50
  },
  {
    id: 'QG-2024-001',
    title: 'Improve Customer Satisfaction Score',
    category: 'Customer Satisfaction',
    targetValue: 95,
    currentValue: 96,
    unit: '%',
    status: 'Achieved',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    owner: 'Mike Johnson',
    description: 'Improve the CSAT score to at least 95% across all major accounts.',
    milestones: [
      { id: 'm1', title: 'Mid-year survey rollout', dueDate: '2024-06-30', status: 'Completed' },
      { id: 'm2', title: 'End-year review', dueDate: '2024-12-20', status: 'Completed' }
    ],
    progress: 100
  }
];
