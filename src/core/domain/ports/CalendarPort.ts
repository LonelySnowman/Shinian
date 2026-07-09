export type CalendarPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type CalendarRecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarRecurrenceRule {
  frequency: CalendarRecurrenceFrequency;
  interval?: number;
}

export interface CalendarEventPayload {
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  notes?: string;
  recurrenceRule?: CalendarRecurrenceRule | null;
}

export interface CalendarInfo {
  id: string;
  title: string;
  isPrimary?: boolean;
}

export interface CalendarPort {
  getPermissionStatus(): Promise<CalendarPermissionStatus>;
  requestPermission(): Promise<CalendarPermissionStatus>;
  listWritableCalendars(): Promise<CalendarInfo[]>;
  getDefaultCalendarId(): Promise<string | null>;
  createEvent(calendarId: string, payload: CalendarEventPayload): Promise<string>;
  updateEvent(eventId: string, payload: CalendarEventPayload): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  eventExists(eventId: string): Promise<boolean>;
}
