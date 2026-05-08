import React, { useState } from 'react';
import { ReportCategory } from './types';
import { OverviewReport } from './OverviewReport';
import { ProductionReport } from './ProductionReport';
import { QualityReport } from './QualityReport';
import { HRReport } from './HRReport';
import { FinancialReport } from './FinancialReport';
import { LayoutDashboard, Factory, ShieldCheck, Users, DollarSign, DownloadCloud } from 'lucide-react';
import { exportToCsv } from './ExportUtils';
import { DEFECTS_DATA, PRODUCTION_TRENDS, QUALITY_TRENDS, TRAINING_STATS, FINANCIAL_METRICS } from './mockData';

export function ReportAnalysisModule() {
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('Overview');

  const categories: { id: ReportCategory, label: string, icon: React.ReactNode }[] = [
    { id: 'Overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'Production', label: 'Production Limits', icon: <Factory className="w-4 h-4" /> },
    { id: 'Quality', label: 'Quality Pareto', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'HR', label: 'HR & Training', icon: <Users className="w-4 h-4" /> },
    { id: 'Financial', label: 'Financial Profit', icon: <DollarSign className="w-4 h-4" /> }
  ];

  const handleExportAll = () => {
    // Sequentially exporting all mock data conceptually. Browser may block multiple downloads, 
    // so in a real app consider zipping or a single big report.
    // For demo, we export just two main ones.
    exportToCsv('production_full_report', PRODUCTION_TRENDS);
    setTimeout(() => { exportToCsv('quality_full_report', QUALITY_TRENDS) }, 500);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 flex-shrink-0">
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
             <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
             >
                {cat.icon} {cat.label}
             </button>
          ))}
        </div>

        <button 
           onClick={handleExportAll}
           className="flex items-center justify-center md:justify-start gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <DownloadCloud className="w-4 h-4" /> Export All Data
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-12">
         {activeCategory === 'Overview' && <OverviewReport />}
         {activeCategory === 'Production' && <ProductionReport />}
         {activeCategory === 'Quality' && <QualityReport />}
         {activeCategory === 'HR' && <HRReport />}
         {activeCategory === 'Financial' && <FinancialReport />}
      </div>
    </div>
  );
}
