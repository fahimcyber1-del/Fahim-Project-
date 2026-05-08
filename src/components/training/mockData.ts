import { TrainingRecord } from './types';

export const INITIAL_TRAININGS: TrainingRecord[] = [
  {
    id: 'TRN-2024-001',
    title: 'ISO 9001:2015 Quality Management Systems Awareness',
    description: 'Introduction to the principles and requirements of ISO 9001:2015 for all new employees.',
    type: 'Internal',
    status: 'Completed',
    trainer: 'Sarah Jenkins',
    location: 'Conference Room A',
    startDate: '2024-03-10',
    endDate: '2024-03-10',
    durationHours: 4,
    maxAttendees: 20,
    attendees: [
      { id: 'A001', name: 'John Doe', department: 'Operations', status: 'Attended', score: 95 },
      { id: 'A002', name: 'Jane Smith', department: 'Engineering', status: 'Attended', score: 88 },
      { id: 'A003', name: 'Mike Johnson', department: 'HR', status: 'Absent' }
    ],
    dateCreated: '2024-02-15',
    dateLastModified: '2024-03-11'
  },
  {
    id: 'TRN-2024-002',
    title: 'Advanced React patterns and Performance Optimization',
    description: 'Deep dive into React performance hooks and scalable architecture.',
    type: 'Online',
    status: 'In Progress',
    trainer: 'External Vendor (TechLearn)',
    location: 'Zoom',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    durationHours: 12,
    maxAttendees: 50,
    attendees: [
      { id: 'A004', name: 'Alice Williams', department: 'Engineering', status: 'Registered' },
      { id: 'A005', name: 'Tom Brown', department: 'Engineering', status: 'Registered' }
    ],
    dateCreated: '2024-04-01',
    dateLastModified: '2024-04-10'
  },
  {
    id: 'TRN-2024-003',
    title: 'Fire Safety and First Aid',
    description: 'Annual mandatory fire safety drill and basic first aid concepts.',
    type: 'Internal',
    status: 'Planned',
    trainer: 'Building Management',
    location: 'Main Lobby / Exterior',
    startDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    durationHours: 2,
    maxAttendees: 200,
    attendees: [],
    dateCreated: '2024-04-15',
    dateLastModified: '2024-04-15'
  }
];
