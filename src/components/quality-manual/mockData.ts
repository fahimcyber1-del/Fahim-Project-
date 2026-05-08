import { QualityManualRecord } from './types';

export const INITIAL_MANUALS: QualityManualRecord[] = [
  {
    id: 'QM-CH1-001',
    title: 'Leadership and Commitment',
    chapter: 'Chapter 1: Leadership',
    version: '1.0',
    status: 'Published',
    author: 'Admin',
    reviewer: 'QA Manager',
    approver: 'Director',
    dateCreated: '2023-01-10',
    dateLastModified: '2023-01-15',
    datePublished: '2023-01-20',
    purpose: 'To define top management commitment to the quality management system.',
    content: 'Top management shall demonstrate leadership and commitment with respect to the QMS by taking accountability for the effectiveness of the QMS, ensuring that the quality policy and quality objectives are established, and promoting the use of the process approach and risk-based thinking.',
    attachments: [],
    versionHistory: [
      {
        version: '1.0',
        dateModified: '2023-01-15',
        modifiedBy: 'Admin',
        changes: 'Initial creation.'
      }
    ]
  },
  {
    id: 'QM-CH2-001',
    title: 'Quality Policy',
    chapter: 'Chapter 2: Policy',
    version: '2.1',
    status: 'Under Review',
    author: 'QA Lead',
    reviewer: 'Director',
    approver: '',
    dateCreated: '2023-05-10',
    dateLastModified: '2024-02-15',
    purpose: 'Establishment of the Quality Policy.',
    content: 'We are committed to providing high-quality products that meet customer expectations and regulatory requirements. We foster a culture of continual improvement and are dedicated to understanding our customers\' needs.',
    attachments: [],
    versionHistory: [
      {
        version: '2.0',
        dateModified: '2023-11-20',
        modifiedBy: 'QA Lead',
        changes: 'Updated policy scope.'
      }
    ]
  }
];
