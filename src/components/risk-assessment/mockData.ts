import { RiskRecord } from './types';

export const INITIAL_RISKS: RiskRecord[] = [
  {
    id: `RA-${new Date().getFullYear()}-001`,
    title: 'Dyeing Process Chemical Exposure',
    dateAssessed: '2023-10-15',
    category: 'Critical Process',
    processName: 'Fabric Dyeing',
    description: 'Potential exposure to distinct hazardous chemicals during the fabric dyeing phase.',
    hazardIdentified: 'Chemical inhalation and skin contact.',
    severity: 4,
    likelihood: 3,
    riskScore: 12,
    riskLevel: 'High',
    mitigationPlan: 'Upgrade ventilation system, mandate advanced PPE, and provide frequent hazardous material handling training.',
    mitigationOwner: 'John Doe',
    mitigationDueDate: '2023-12-01',
    residualSeverity: 4,
    residualLikelihood: 1,
    residualRiskScore: 4,
    residualRiskLevel: 'Low',
    status: 'Mitigated',
    attachments: []
  },
  {
    id: `RA-${new Date().getFullYear()}-002`,
    title: 'Button Choking Hazard for Kids Wear',
    dateAssessed: '2023-11-20',
    category: 'Product',
    productDetails: {
      itemCategory: 'Kids Wear',
      styleNumber: 'KW-Win-001'
    },
    description: 'Small buttons used in the winter collection could pose a choking hazard for infants.',
    hazardIdentified: 'Choking hazard if buttons detach.',
    severity: 5,
    likelihood: 2,
    riskScore: 10,
    riskLevel: 'High',
    mitigationPlan: 'Use reinforced double stitching for buttons and perform pull tests on 100% of the baby wear items.',
    mitigationOwner: 'Sarah Connor',
    mitigationDueDate: '2023-12-15',
    status: 'Active',
    attachments: []
  },
  {
    id: `RA-${new Date().getFullYear()}-003`,
    title: 'Automated Sewing Machine Jam',
    dateAssessed: '2023-12-05',
    category: 'Process',
    processName: 'Automated Sewing',
    description: 'New automated sewing machines occasionally jam, leading to operator interventions that bypass safety guards.',
    hazardIdentified: 'Pinch points and needle puncture wounds.',
    severity: 3,
    likelihood: 4,
    riskScore: 12,
    riskLevel: 'High',
    mitigationPlan: 'Implement automatic shutoff when guards are lifted and train operators on safe clearing procedures.',
    mitigationOwner: 'Mike Smith',
    mitigationDueDate: '2024-01-31',
    status: 'Draft',
    attachments: []
  }
];
