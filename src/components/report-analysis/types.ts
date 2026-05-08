export type ReportCategory = 'Overview' | 'Production' | 'Quality' | 'HR' | 'Financial';

export interface DefectData {
  name: string;
  count: number;
}

export interface ProductionTrend {
  date: string;
  planned: number;
  actual: number;
  efficiency: number;
}

export interface QualityTrend {
  month: string;
  defectRate: number;
  reworkRate: number;
  targetRate: number;
}

export interface TrainingStats {
  department: string;
  completedHours: number;
  plannedHours: number;
}

export interface FinancialMetric {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface SupplierPerformance {
  supplier: string;
  deliveryScore: number;
  qualityScore: number;
  communicationScore: number;
  overallScore: number;
}

export interface MonthlyDefectRate {
  garmentType: string;
  line: string;
  totalInspected: number;
  defectCount: number;
  defectRate: number;
}

export interface QuarterDefect {
  name: string;
  count: number;
}
