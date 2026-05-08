import React from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Users, Link as LinkIcon, Edit3, Trash2, AlignLeft } from 'lucide-react';
import { AppEvent } from './types';

interface EventDetailProps {
  event: AppEvent;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetail({ event, onBack, onEdit, onDelete }: EventDetailProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-bold text-slate-900">Event Details</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onEdit}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={() => {
                if(window.confirm('Are you sure you want to delete this event?')) {
                  onDelete();
                }
              }}
              className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-100 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                  event.type === 'Conference' ? 'bg-purple-100 text-purple-700' :
                  event.type === 'Training' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'Meeting' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.type}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  event.status === 'ongoing' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.status}
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6 lg:p-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Date</h3>
                    <p className="text-slate-600 mt-1">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Time</h3>
                    <p className="text-slate-600 mt-1">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Location</h3>
                    <p className="text-slate-600 mt-1">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Attendees</h3>
                    <p className="text-slate-600 mt-1">{event.attendees} people</p>
                  </div>
                </div>

                {event.joinLink && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Virtual Link</h3>
                      <a href={event.joinLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline mt-1 block truncate">
                        {event.joinLink}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <div className="border-t border-slate-100 pt-8 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlignLeft className="w-5 h-5 text-slate-500" />
                  <h3 className="text-lg font-bold text-slate-900">About this {event.type}</h3>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 text-sm whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
