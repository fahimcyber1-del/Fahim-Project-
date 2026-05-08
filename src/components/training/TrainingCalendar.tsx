import React, { useState } from 'react';
import { TrainingRecord } from './types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';

interface TrainingCalendarProps {
  records: TrainingRecord[];
  onView: (id: string) => void;
}

export function TrainingCalendar({ records, onView }: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
           <CalendarIcon className="w-5 h-5 text-indigo-600" />
           {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 hover:bg-slate-200 rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-md transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-slate-200 rounded-md transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-auto bg-white min-h-0">
         <div className="grid grid-cols-7 border-b border-slate-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                {day}
              </div>
            ))}
         </div>
         <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {days.map((day, idx) => {
              const dayTrainings = records.filter(r => isSameDay(parseISO(r.startDate), day));
              
              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-[100px] border-b border-r border-slate-100 p-2 flex flex-col gap-1
                    ${!isSameMonth(day, monthStart) ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-900'}
                    ${isSameDay(day, new Date()) ? 'bg-indigo-50 border-indigo-100' : ''}
                  `}
                >
                  <div className="flex justify-end mb-1">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-indigo-600 text-white' : ''}`}>
                      {format(day, dateFormat)}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-1">
                     {dayTrainings.map(training => (
                        <div 
                          key={training.id}
                          onClick={() => onView(training.id)}
                          className="bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-2 py-1 rounded truncate cursor-pointer hover:bg-indigo-200 transition-colors"
                          title={training.title}
                        >
                          <div className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{training.durationHours}h</div>
                          <div className="truncate">{training.title}</div>
                        </div>
                     ))}
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
}
