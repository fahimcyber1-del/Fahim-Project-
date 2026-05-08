import React from 'react';
import { AuditRecord } from './types';
import { ClipboardCheck, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface AuditDashboardProps {
  audits: AuditRecord[];
}

export function AuditDashboard({ audits }: AuditDashboardProps) {
  const completedCount = audits.filter(a => a.status === 'COMPLETED').length;
  const inProgressCount = audits.filter(a => a.status === 'IN_PROGRESS').length;
  const plannedCount = audits.filter(a => a.status === 'PLANNED').length;
  
  const allFindings = audits.flatMap(a => a.findings);
  const openFindingsCount = allFindings.filter(f => f.status === 'OPEN').length;

  const upcomingAudits = [...audits]
    .filter(a => a.status === 'PLANNED')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800">Audit Dashboard</h2>
        <p className="text-slate-500 font-medium mt-1">Overview of compliance and audit activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Audits</h3>
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-800">{audits.length}</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</h3>
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-700">{inProgressCount}</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Planned</h3>
            <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-700">{plannedCount}</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Open Findings</h3>
            <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">{openFindingsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Upcoming Audits</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            {upcomingAudits.length > 0 ? (
              upcomingAudits.map(audit => (
                <div key={audit.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg h-fit">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{audit.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">{audit.date} • {audit.auditor}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {audit.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No upcoming audits planned.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Critical Open Findings</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            {audits.flatMap(a => a.findings.map(f => ({ ...f, auditTitle: a.title, auditId: a.id })))
              .filter(f => f.status === 'OPEN' && (f.severity === 'MAJOR' || f.severity === 'CRITICAL'))
              .slice(0, 5)
              .map(finding => (
                <div key={finding.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-lg h-fit">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{finding.description}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">From: {finding.auditTitle}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
