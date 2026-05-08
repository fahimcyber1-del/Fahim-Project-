import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { AppEvent } from './types';

interface EventListProps {
  events: AppEvent[];
  onViewDetail: (id: string) => void;
}

export function EventList({ events, onViewDetail }: EventListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredEvents = events.filter(event => 
    activeTab === 'upcoming' ? ['upcoming', 'ongoing'].includes(event.status) : event.status === 'past'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none pt-2 pb-0 border-b border-slate-200 bg-white px-4 lg:px-6">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar">
          <div className="flex space-x-1 min-w-max pb-px">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative ${
                activeTab === 'upcoming' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              Upcoming & Ongoing
              {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative ${
                activeTab === 'past' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              Past Events
              {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" onClick={() => onViewDetail(event.id)}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                    event.type === 'Conference' ? 'bg-purple-100 text-purple-700' :
                    event.type === 'Training' ? 'bg-blue-100 text-blue-700' :
                    event.type === 'Meeting' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {event.type}
                  </span>
                  {event.status === 'ongoing' && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      HAPPENING NOW
                    </span>
                  )}
                  {event.status === 'past' && (
                    <span className="text-xs font-semibold text-slate-400">Ended</span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">{event.title}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{event.attendees} Attendees {activeTab === 'upcoming' ? 'Expected' : 'Joined'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-indigo-600 font-bold text-sm hover:text-indigo-700 flex items-center gap-1">
                  View Details <ArrowRight className="w-4 h-4" />
                </span>
                {event.joinLink && activeTab === 'upcoming' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); window.open(event.joinLink, '_blank'); }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                  >
                    Join <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <p className="text-lg font-semibold text-slate-900">No events found</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                There are currently no {activeTab} events scheduled at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
