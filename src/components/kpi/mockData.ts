import { KpiRecord } from './types';

export const INITIAL_KPIS: KpiRecord[] = [
  {
    id: 'KPI-001',
    title: 'Defect Rate',
    category: 'Quality',
    department: 'Production',
    target: 2.0,
    currentValue: 1.8,
    unit: '%',
    frequency: 'Monthly',
    owner: 'John Doe',
    status: 'On Track',
    lastUpdated: '2023-11-01',
    description: 'Percentage of products that fail inspection.',
    history: [
      { date: '2023-08-01', value: 2.5 },
      { date: '2023-09-01', value: 2.2 },
      { date: '2023-10-01', value: 1.9 },
      { date: '2023-11-01', value: 1.8 },
    ]
  },
  {
    id: 'KPI-002',
    title: 'On-Time Delivery',
    category: 'Operations',
    department: 'Logistics',
    target: 95,
    currentValue: 92,
    unit: '%',
    frequency: 'Monthly',
    owner: 'Jane Smith',
    status: 'At Risk',
    lastUpdated: '2023-11-01',
    description: 'Percentage of orders delivered on or before the promised date.',
    history: [
      { date: '2023-08-01', value: 96 },
      { date: '2023-09-01', value: 94 },
      { date: '2023-10-01', value: 93 },
      { date: '2023-11-01', value: 92 },
    ]
  },
  {
    id: 'KPI-003',
    title: 'Machine Downtime',
    category: 'Maintenance',
    department: 'Engineering',
    target: 5.0,
    currentValue: 6.5,
    unit: '%',
    frequency: 'Weekly',
    owner: 'Mike Johnson',
    status: 'Off Track',
    lastUpdated: '2023-11-05',
    description: 'Percentage of time machines are unavailable due to maintenance or breakdown.',
    history: [
      { date: '2023-10-15', value: 4.5 },
      { date: '2023-10-22', value: 5.2 },
      { date: '2023-10-29', value: 6.0 },
      { date: '2023-11-05', value: 6.5 },
    ]
  }
];
