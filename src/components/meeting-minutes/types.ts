export type MeetingStatus = 'Draft' | 'Published' | 'Archived';
export type MeetingType = 'General' | 'Management Review' | 'Project status' | 'Board Meeting' | 'Other';

export interface Participant {
  id: string;
  name: string;
  role: string;
  department: string;
  attended: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  presenter: string;
  durationMinutes: number;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Deferred';
}

export interface MeetingRecord {
  id: string; // e.g., MM-2024-001
  title: string;
  type: MeetingType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  organizer: string;
  status: MeetingStatus;
  objective: string;
  participants: Participant[];
  agenda: AgendaItem[];
  minutes: string;
  actionItems: ActionItem[];
  followUpRequired?: boolean;
  nextMeetingDate?: string;
  decision?: string;
  dateCreated: string;
  dateLastModified: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'calendar' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
