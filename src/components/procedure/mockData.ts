import { ProcedureRecord } from './types';

export const INITIAL_PROCEDURES: ProcedureRecord[] = [
  {
    id: 'PROC-SFTY-001',
    title: 'Emergency Evacuation Procedure',
    type: 'Emergency',
    department: 'Health & Safety',
    version: '2.1',
    status: 'Published',
    author: 'Safety Officer',
    reviewer: 'Facility Manager',
    approver: 'Director',
    dateCreated: '2023-03-10',
    dateLastModified: '2024-01-15',
    datePublished: '2024-01-20',
    purpose: 'To ensure a safe and orderly structured evacuation of all personnel during an emergency.',
    scope: 'Applies to all employees, contractors, and visitors within the facility.',
    prerequisites: 'Ensure alarm system is functional. Evacuation wardens must be trained.',
    steps: '1. Sound the alarm.\n2. Stop all operations immediately.\n3. Follow the designated escape routes quietly and quickly.\n4. Assemble at the designated muster points.\n5. Roll call taken by wardens.',
    attachments: [],
    versionHistory: [
      {
        version: '2.1',
        dateModified: '2024-01-15',
        modifiedBy: 'Safety Officer',
        changes: 'Updated muster point locations.'
      },
      {
        version: '2.0',
        dateModified: '2023-03-10',
        modifiedBy: 'Safety Officer',
        changes: 'Initial creation.'
      }
    ]
  },
  {
    id: 'PROC-TECH-012',
    title: 'Machine Calibration Process',
    type: 'Technical',
    department: 'Maintenance',
    version: '1.0',
    status: 'Under Review',
    author: 'Lead Engineer',
    reviewer: 'Maintenance Manager',
    approver: '',
    dateCreated: '2024-04-05',
    dateLastModified: '2024-04-10',
    purpose: 'Establish standard operational steps for machine calibration to ensure accurate production.',
    scope: 'All heavy machinery in production block A.',
    prerequisites: 'Gather calibration tools (micrometer, standard weights). Machine must be powered off correctly before starting.',
    steps: '1. Lockout/Tagout machine.\n2. Clean calibration points.\n3. Apply standard weights/measurements.\n4. Adjust dial until readings match standard.\n5. Log calibration values in the system.',
    attachments: [],
    versionHistory: [
      {
        version: '1.0',
        dateModified: '2024-04-05',
        modifiedBy: 'Lead Engineer',
        changes: 'Draft created.'
      }
    ]
  }
];
