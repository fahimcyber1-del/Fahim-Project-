export type TrainingStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
export type TrainingType = 'Internal' | 'External' | 'Online' | 'On-the-job';

export interface Attendee {
  id: string;
  name: string;
  department: string;
  status: 'Registered' | 'Attended' | 'Absent';
  score?: number;
}

export interface TrainingRecord {
  id: string; // e.g., TRN-2024-001
  title: string;
  description: string;
  type: TrainingType;
  status: TrainingStatus;
  trainer: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  durationHours: number;
  maxAttendees: number;
  attendees: Attendee[];
  dateCreated: string;
  dateLastModified: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'plan' }
  | { type: 'calendar' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
