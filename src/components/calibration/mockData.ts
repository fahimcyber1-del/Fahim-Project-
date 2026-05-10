import { Equipment } from './types';

export const mockEquipment: Equipment[] = [
  {
    id: 'EQ-2023-001',
    name: 'Tensile Strength Tester',
    manufacturer: 'Instron',
    model: '5960 Dual Column',
    serialNumber: 'IN-4459-A',
    location: 'Lab 1 - Main Floor',
    status: 'ACTIVE',
    lastCalibrationDate: '2023-05-12',
    nextCalibrationDate: '2024-05-12',
    calibrationFrequency: 12,
    calibrationType: 'EXTERNAL',
    vendor: 'Calibron Solutions',
    certificateNumber: 'CERT-884920',
    tolerance: '+/- 0.5%',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    calibrations: [
      {
        id: 'CR-001',
        equipmentId: 'EQ-2023-001',
        date: '2023-05-12',
        performedBy: 'Calibron Solutions (Ext)',
        result: 'PASS',
        notes: 'Routine annual calibration performed.'
      }
    ]
  },
  {
    id: 'EQ-2023-002',
    name: 'Digital Light Box',
    manufacturer: 'Verivide',
    model: 'CAC 60',
    serialNumber: 'VV-884-21',
    location: 'Color Assessment Room',
    status: 'CALIBRATION_DUE',
    lastCalibrationDate: '2023-04-15',
    nextCalibrationDate: '2023-10-15',
    calibrationFrequency: 6,
    calibrationType: 'INTERNAL',
    tolerance: 'Lux matching specification',
    calibrations: [
      {
        id: 'CR-002',
        equipmentId: 'EQ-2023-002',
        date: '2023-04-15',
        performedBy: 'James Wilson',
        result: 'PASS',
        notes: 'D65 and TL84 tubes replaced and verified.'
      }
    ]
  },
  {
    id: 'EQ-2023-003',
    name: 'Crockmeter',
    manufacturer: 'Atlas',
    model: 'CM-1',
    serialNumber: 'AT-992-00',
    location: 'Physical Testing Lab',
    status: 'ACTIVE',
    lastCalibrationDate: '2023-08-20',
    nextCalibrationDate: '2024-08-20',
    calibrationFrequency: 12,
    calibrationType: 'INTERNAL',
    tolerance: 'Standard finger weight and stroke',
    calibrations: [
      {
        id: 'CR-003',
        equipmentId: 'EQ-2023-003',
        date: '2023-08-20',
        performedBy: 'Sarah Davis',
        result: 'PASS',
        notes: 'Stroke length and weight verified.'
      }
    ]
  },
  {
    id: 'EQ-2023-004',
    name: 'Spectrophotometer',
    manufacturer: 'Datacolor',
    model: '800V',
    serialNumber: 'DC-800-4411',
    location: 'Color Assessment Room',
    status: 'OUT_OF_SERVICE',
    lastCalibrationDate: '2023-01-10',
    nextCalibrationDate: '2024-01-10',
    calibrationFrequency: 12,
    calibrationType: 'EXTERNAL',
    vendor: 'Datacolor Support',
    tolerance: 'Delta E < 0.15',
    calibrations: [
      {
        id: 'CR-004',
        equipmentId: 'EQ-2023-004',
        date: '2023-01-10',
        performedBy: 'Datacolor Field Service',
        result: 'FAIL',
        notes: 'White tile calibration failing consistently. Unit sent for main board repair.'
      }
    ]
  }
];
