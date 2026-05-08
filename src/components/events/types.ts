export type EventStatus = 'upcoming' | 'ongoing' | 'past';
export type EventType = 'Conference' | 'Training' | 'Meeting' | 'Workshop' | string;

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  status: EventStatus;
  attendees: number;
  description?: string;
  joinLink?: string;
}
