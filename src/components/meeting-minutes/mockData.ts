import { MeetingRecord } from './types';

export const INITIAL_MEETINGS: MeetingRecord[] = [
  {
    id: 'MM-2024-001',
    title: 'Q1 Management Review',
    type: 'Management Review',
    date: '2024-03-15',
    time: '10:00',
    location: 'Conference Room A',
    organizer: 'Sarah Jenkins',
    status: 'Published',
    objective: 'Review Q1 performance against quality objectives and discuss resource needs.',
    participants: [
      { id: 'P001', name: 'Sarah Jenkins', role: 'Quality Manager', department: 'QA', attended: true },
      { id: 'P002', name: 'Mike Johnson', role: 'Operations Director', department: 'Operations', attended: true },
      { id: 'P003', name: 'Jane Smith', role: 'HR Manager', department: 'HR', attended: false }
    ],
    agenda: [
      { id: 'A001', title: 'Review of Quality Metrics', description: 'Analyze KPI performance for Q1', presenter: 'Sarah Jenkins', durationMinutes: 30 },
      { id: 'A002', title: 'Resource Needs Assessment', description: 'Discuss staffing requirements for Q2', presenter: 'Mike Johnson', durationMinutes: 20 }
    ],
    minutes: 'The meeting commenced with a review of the Q1 quality metrics. It was noted that defect rates have decreased by 2% compared to the previous quarter. Operations requested additional headcount for the assembly line to manage the expected Q2 volume surge.',
    actionItems: [
      { id: 'ACT001', description: 'Prepare detailed staffing proposal for Q2', assignedTo: 'Mike Johnson', dueDate: '2024-03-25', status: 'In Progress' },
      { id: 'ACT002', description: 'Schedule meeting to discuss staffing with HR', assignedTo: 'Sarah Jenkins', dueDate: '2024-03-20', status: 'Completed' }
    ],
    followUpRequired: true,
    nextMeetingDate: '2024-04-15',
    decision: 'Approved additional headcount for Q2 assembly line. HR will initiate recruitment.',
    dateCreated: '2024-03-10',
    dateLastModified: '2024-03-16'
  },
  {
    id: 'MM-2024-002',
    title: 'Weekly Project Sync: Apollo',
    type: 'Project status',
    date: '2024-04-10',
    time: '14:00',
    location: 'Zoom',
    organizer: 'Tom Brown',
    status: 'Draft',
    objective: 'Weekly synchronization on Project Apollo deliverables.',
    participants: [
      { id: 'P004', name: 'Tom Brown', role: 'Project Manager', department: 'PMO', attended: true },
      { id: 'P005', name: 'Alice Williams', role: 'Lead Engineer', department: 'Engineering', attended: true }
    ],
    agenda: [
      { id: 'A003', title: 'Sprint Review', description: 'Review completed tickets', presenter: 'Alice Williams', durationMinutes: 15 }
    ],
    minutes: '',
    actionItems: [],
    dateCreated: '2024-04-05',
    dateLastModified: '2024-04-10'
  }
];
