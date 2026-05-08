export type KpiStatus = 'On Track' | 'At Risk' | 'Off Track';

export interface KpiHistory {
  date: string;
  value: number;
}

export interface KpiRecord {
  id: string;
  title: string;
  category: string;
  department: string;
  target: number;
  currentValue: number;
  unit: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  owner: string;
  status: KpiStatus;
  lastUpdated: string;
  history: KpiHistory[];
  description?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
