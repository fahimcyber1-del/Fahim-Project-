import { RootCauseRecord } from './types';

export const INITIAL_RCA_RECORDS: RootCauseRecord[] = [
  {
    id: `RCA-${new Date().getFullYear()}-001`,
    title: 'High Defect Rate in Stitching Line 3',
    dateInitiated: '2023-09-15',
    leadInvestigator: 'Alice Johnson',
    relatedIssueId: 'CAPA-2023-010',
    status: 'Completed',
    method: '5 Whys',
    analysisData: {
      problemStatement: 'High defect rate found on stitching line 3.',
      why1: 'Operators were rushing to meet increased target.',
      why2: 'Target was increased by 20% without adding resources.',
      why3: 'Production planning did not account for machine speed limits.',
      why4: 'Planning relied on outdated machine specs.',
      why5: 'Maintenance DB wasn\'t updated after recent machine audits.',
      rootCause: 'Lack of data synchronization between Maintenance and Planning.'
    },
    correctiveActionsProposed: 'Implement automated synchronization of machine specs between maintenance DB and production planning software.',
    attachments: []
  },
  {
    id: `RCA-${new Date().getFullYear()}-002`,
    title: 'Color Fading in Summer Collection',
    dateInitiated: '2023-11-05',
    leadInvestigator: 'Bob Smith',
    relatedIssueId: 'QA-2023-045',
    status: 'In Progress',
    method: 'Fishbone (Ishikawa)',
    analysisData: {
      problemStatement: 'Summer collection fabric showing color fading after 2 washes.',
      manpower: 'New dyeing team members lacked experience with this fabric.',
      machine: 'Dyeing vat temperature sensor miscalibrated.',
      material: 'Dye batch #802 had lower concentration than specified.',
      method: 'Standard operating procedure for this specific dye not followed.',
      measurement: 'Color fastness test skipped before bulk production.',
      environment: 'High humidity in storage area affecting dye bonding.',
      rootCause: 'Skipped color fastness pre-production test due to schedule pressure and uncalibrated sensor.'
    },
    correctiveActionsProposed: 'Calibrate all dyeing sensors tracking. Enforce mandatory color fastness testing for every new batch before approval.',
    attachments: []
  }
];
