import { DefectData, ProductionTrend, QualityTrend, TrainingStats, FinancialMetric, SupplierPerformance, MonthlyDefectRate, QuarterDefect } from './types';

export const DEFECTS_DATA: DefectData[] = [
  { name: 'Broken Stitch', count: 120 },
  { name: 'Stain', count: 85 },
  { name: 'Uneven Hem', count: 65 },
  { name: 'Missing Label', count: 40 },
  { name: 'Fabric Flaw', count: 30 },
  { name: 'Color Bleed', count: 15 },
];

export const PRODUCTION_TRENDS: ProductionTrend[] = [
  { date: 'Mon', planned: 500, actual: 480, efficiency: 96 },
  { date: 'Tue', planned: 500, actual: 510, efficiency: 102 },
  { date: 'Wed', planned: 500, actual: 450, efficiency: 90 },
  { date: 'Thu', planned: 500, actual: 490, efficiency: 98 },
  { date: 'Fri', planned: 500, actual: 520, efficiency: 104 },
  { date: 'Sat', planned: 300, actual: 300, efficiency: 100 },
];

export const QUALITY_TRENDS: QualityTrend[] = [
  { month: 'Jan', defectRate: 3.2, reworkRate: 1.5, rftRate: 95.3, targetRate: 2.0 },
  { month: 'Feb', defectRate: 2.8, reworkRate: 1.2, rftRate: 96.0, targetRate: 2.0 },
  { month: 'Mar', defectRate: 3.5, reworkRate: 1.8, rftRate: 94.7, targetRate: 2.0 },
  { month: 'Apr', defectRate: 2.1, reworkRate: 0.9, rftRate: 97.0, targetRate: 2.0 },
  { month: 'May', defectRate: 1.8, reworkRate: 0.7, rftRate: 97.5, targetRate: 2.0 },
  { month: 'Jun', defectRate: 1.5, reworkRate: 0.5, rftRate: 98.0, targetRate: 2.0 },
];

export const TRAINING_STATS: TrainingStats[] = [
  { department: 'Production', completedHours: 450, plannedHours: 500 },
  { department: 'Q.A.', completedHours: 120, plannedHours: 100 },
  { department: 'Maintenance', completedHours: 80, plannedHours: 100 },
  { department: 'HR', completedHours: 40, plannedHours: 40 },
  { department: 'Management', completedHours: 60, plannedHours: 80 },
];

export const FINANCIAL_METRICS: FinancialMetric[] = [
  { month: 'Jan', revenue: 120000, cost: 85000, profit: 35000 },
  { month: 'Feb', revenue: 135000, cost: 90000, profit: 45000 },
  { month: 'Mar', revenue: 110000, cost: 82000, profit: 28000 },
  { month: 'Apr', revenue: 145000, cost: 95000, profit: 50000 },
  { month: 'May', revenue: 160000, cost: 100000, profit: 60000 },
  { month: 'Jun', revenue: 155000, cost: 98000, profit: 57000 },
];

export const SUPPLIER_PERFORMANCE: SupplierPerformance[] = [
  { supplier: 'TexFabrics Co.', deliveryScore: 95, qualityScore: 98, communicationScore: 90, overallScore: 94.3 },
  { supplier: 'ThreadWorks', deliveryScore: 88, qualityScore: 92, communicationScore: 85, overallScore: 88.3 },
  { supplier: 'Global Dyes', deliveryScore: 98, qualityScore: 85, communicationScore: 95, overallScore: 92.6 },
  { supplier: 'Trim Accessories', deliveryScore: 82, qualityScore: 90, communicationScore: 80, overallScore: 84.0 },
  { supplier: 'EcoPolymer', deliveryScore: 92, qualityScore: 96, communicationScore: 92, overallScore: 93.3 },
];

export const MONTHLY_DEFECT_RATES: MonthlyDefectRate[] = [
  { garmentType: 'T-Shirt', line: 'Line 1', totalInspected: 5000, defectCount: 150, defectRate: 3.0 },
  { garmentType: 'T-Shirt', line: 'Line 2', totalInspected: 4800, defectCount: 180, defectRate: 3.8 },
  { garmentType: 'Jeans', line: 'Line 3', totalInspected: 3000, defectCount: 120, defectRate: 4.0 },
  { garmentType: 'Jacket', line: 'Line 4', totalInspected: 1500, defectCount: 90, defectRate: 6.0 },
  { garmentType: 'Polo Shirt', line: 'Line 1', totalInspected: 2500, defectCount: 50, defectRate: 2.0 },
  { garmentType: 'Polo Shirt', line: 'Line 2', totalInspected: 2200, defectCount: 66, defectRate: 3.0 },
  { garmentType: 'Dress', line: 'Line 5', totalInspected: 1000, defectCount: 55, defectRate: 5.5 },
];

export const TOP_DEFECTS_LAST_QUARTER: QuarterDefect[] = [
  { name: 'Broken Stitch', count: 420 },
  { name: 'Stain', count: 315 },
  { name: 'Uneven Hem', count: 210 },
  { name: 'Fabric Flaw', count: 145 },
  { name: 'Missing Label', count: 85 },
];
