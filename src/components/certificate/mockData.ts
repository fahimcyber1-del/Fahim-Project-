import { CertificateRecord } from './types';

export const mockCertificates: CertificateRecord[] = [
  {
    id: 'CRT-2023-001',
    title: 'ISO 9001:2015 Quality Management',
    issuer: 'TUV SUD',
    type: 'SYSTEM',
    status: 'ACTIVE',
    issueDate: '2023-01-15',
    expiryDate: '2026-01-14',
    referenceNumber: 'ISO9001-2023-XYZ',
    scope: 'Design, development, and manufacturing of textiles',
    lastAuditDate: '2023-11-20',
    remarks: 'Next surveillance audit in Nov 2024.'
  },
  {
    id: 'CRT-2023-002',
    title: 'OEKO-TEX Standard 100',
    issuer: 'Hohenstein',
    type: 'PRODUCT',
    status: 'EXPIRING_SOON',
    issueDate: '2023-02-01',
    expiryDate: '2024-01-31',
    referenceNumber: 'OEK-100-2441',
    scope: 'Woven fabrics made of 100% cotton',
    remarks: 'Renewal application submitted.'
  },
  {
    id: 'CRT-2023-003',
    title: 'Global Organic Textile Standard (GOTS)',
    issuer: 'Control Union',
    type: 'MATERIAL',
    status: 'ACTIVE',
    issueDate: '2023-05-10',
    expiryDate: '2024-05-09',
    referenceNumber: 'CU-GOTS-88221',
    scope: 'Processing of organic fibers',
  },
  {
    id: 'CRT-2023-004',
    title: 'REACH Compliance Certification',
    issuer: 'Intertek',
    type: 'COMPLIANCE',
    status: 'EXPIRED',
    issueDate: '2022-01-01',
    expiryDate: '2022-12-31',
    referenceNumber: 'RCH-2022-UK',
    scope: 'Chemical testing for EU markets',
    remarks: 'Awaiting new test results.'
  }
];
