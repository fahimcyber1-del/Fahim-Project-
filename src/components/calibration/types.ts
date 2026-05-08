export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CALIBRATION_DUE' | 'OUT_OF_SERVICE';
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibrationFrequency: number; // in months
  calibrationType: 'INTERNAL' | 'EXTERNAL';
  vendor?: string;
  certificateNumber?: string;
  tolerance?: string;
  remarks?: string;
  imageUrl?: string;
  certificateUrl?: string;
  calibrations: CalibrationRecord[];
}

export interface CalibrationRecord {
  id: string;
  equipmentId: string;
  date: string;
  performedBy: string;
  result: 'PASS' | 'FAIL' | 'ADJUSTED';
  certificateUrl?: string;
  notes?: string;
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form'; recordId?: string }
  | { type: 'detail'; recordId: string };
