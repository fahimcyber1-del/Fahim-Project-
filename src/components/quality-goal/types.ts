export type GoalStatus = 'On Track' | 'At Risk' | 'Off Track' | 'Achieved';
export type GoalCategory = 'Defect Rate' | 'Customer Satisfaction' | 'Compliance' | 'Process Efficiency' | 'Safety' | 'Other';

export interface GoalMilestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

export interface QualityGoalRecord {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  owner?: string;
  description: string;
  milestones: GoalMilestone[];
  progress?: number;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
