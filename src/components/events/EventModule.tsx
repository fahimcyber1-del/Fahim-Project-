import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { AppEvent } from './types';
import { EventList } from './EventList';
import { EventForm } from './EventForm';
import { EventDetail } from './EventDetail';

const MOCK_EVENTS: AppEvent[] = [
  { id: '1', title: 'Annual Quality Summit 2026', date: '2026-06-15', time: '09:00 AM - 05:00 PM', location: 'Hilton Convention Center', type: 'Conference', status: 'upcoming', attendees: 150, description: 'Join us for the annual quality summit to discuss new standards and best practices.' },
  { id: '2', title: 'ISO 9001:2015 Internal Auditor Training', date: '2026-05-20', time: '10:00 AM - 12:00 PM', location: 'Virtual (Zoom)', type: 'Training', status: 'upcoming', attendees: 35, joinLink: 'https://zoom.us/j/123456789' },
  { id: '3', title: 'Monthly Management Review', date: '2026-05-05', time: '02:00 PM - 04:00 PM', location: 'Boardroom A', type: 'Meeting', status: 'ongoing', attendees: 12 },
  { id: '4', title: 'Supplier Quality Workshop', date: '2026-04-12', time: '09:00 AM - 01:00 PM', location: 'Factory Main Hall', type: 'Workshop', status: 'past', attendees: 45 },
];

type ViewState = 
  | { type: 'list' }
  | { type: 'form', eventId?: string }
  | { type: 'detail', eventId: string };

export function EventModule() {
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);
  const [viewState, setViewState] = useState<ViewState>({ type: 'list' });

  const handleSaveEvent = (savedEvent: AppEvent) => {
    if (viewState.type === 'form' && viewState.eventId) {
      setEvents(events.map(e => e.id === savedEvent.id ? savedEvent : e));
    } else {
      setEvents([...events, savedEvent]);
    }
    setViewState({ type: 'list' });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setViewState({ type: 'list' });
  };

  const currentEvent = viewState.type === 'detail' || (viewState.type === 'form' && viewState.eventId)
    ? events.find(e => e.id === (viewState as any).eventId) || null
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {viewState.type === 'list' && (
        <>
          <div className="flex-none p-4 lg:p-6 pb-0 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-indigo-600" />
                  Events & Schedules
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Manage company events, trainings, and important schedules</p>
              </div>
              <button 
                onClick={() => setViewState({ type: 'form' })}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          </div>
          <EventList events={events} onViewDetail={(id) => setViewState({ type: 'detail', eventId: id })} />
        </>
      )}

      {viewState.type === 'form' && (
        <EventForm 
          initialData={currentEvent} 
          onSave={handleSaveEvent} 
          onCancel={() => setViewState({ type: 'list' })} 
        />
      )}

      {viewState.type === 'detail' && currentEvent && (
        <EventDetail 
          event={currentEvent} 
          onBack={() => setViewState({ type: 'list' })}
          onEdit={() => setViewState({ type: 'form', eventId: currentEvent.id })}
          onDelete={() => handleDeleteEvent(currentEvent.id)}
        />
      )}
    </div>
  );
}
