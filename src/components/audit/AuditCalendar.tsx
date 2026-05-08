import React, { useState } from 'react';
import { AuditRecord } from './types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditCalendarProps {
  audits: AuditRecord[];
}

export function AuditCalendar({ audits }: AuditCalendarProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const filteredAudits = audits.filter(audit => {
      const date = new Date(audit.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const sortedAudits = [...filteredAudits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-w-7xl mx-auto w-full">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" /> Audit Schedule
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-700 mx-2">{monthNames[currentMonth]} {currentYear}</span>
          <button onClick={nextMonth} className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {sortedAudits.map((audit) => (
            <div key={audit.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600">{audit.date}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    audit.status === 'PLANNED' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {audit.status}
                  </span>
                </div>
                <h3 className="text-md font-bold text-slate-800">{audit.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{audit.type} Audit • {audit.department}</p>
                <div className="mt-3 text-xs font-medium text-slate-400">
                  Auditor: <span className="text-slate-600">{audit.auditor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
