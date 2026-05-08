import React, { useState } from 'react';
import { MeetingRecord } from './types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';

interface MeetingCalendarProps {
  records: MeetingRecord[];
  onView: (id: string) => void;
}

export function MeetingCalendar({ records, onView }: MeetingCalendarProps) {
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

  const getMeetingColor = (status: string) => {
    switch(status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'Archived': return 'bg-slate-200 text-slate-800 hover:bg-slate-300';
      default: return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
    }
  }

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
              const dayMeetings = records.filter(r => isSameDay(parseISO(r.date), day));
              
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
                     {dayMeetings.map(meeting => (
                        <div 
                          key={meeting.id}
                          onClick={() => onView(meeting.id)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded truncate cursor-pointer transition-colors ${getMeetingColor(meeting.status)}`}
                          title={meeting.title}
                        >
                          <div className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{meeting.time}</div>
                          <div className="truncate">{meeting.title}</div>
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
