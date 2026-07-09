import { Platform } from 'react-native';
import {
  createEventAsync,
  deleteEventAsync,
  EntityTypes,
  Frequency,
  getCalendarsAsync,
  getCalendarPermissionsAsync,
  getDefaultCalendarAsync,
  getEventAsync,
  requestCalendarPermissionsAsync,
  updateEventAsync,
  type RecurrenceRule,
} from 'expo-calendar/legacy';

import type {
  CalendarEventPayload,
  CalendarInfo,
  CalendarPermissionStatus,
  CalendarPort,
  CalendarRecurrenceRule,
} from '@/src/core/domain/ports/CalendarPort';

function mapPermissionStatus(status: string): CalendarPermissionStatus {
  if (status === 'granted') {
    return 'granted';
  }
  if (status === 'denied') {
    return 'denied';
  }
  return 'undetermined';
}

function mapRecurrenceRule(rule?: CalendarRecurrenceRule | null): RecurrenceRule | null {
  if (!rule) {
    return null;
  }

  const frequencyMap: Record<CalendarRecurrenceRule['frequency'], Frequency> = {
    daily: Frequency.DAILY,
    weekly: Frequency.WEEKLY,
    monthly: Frequency.MONTHLY,
    yearly: Frequency.YEARLY,
  };

  return {
    frequency: frequencyMap[rule.frequency],
    interval: rule.interval ?? 1,
  };
}

function mapEventPayload(payload: CalendarEventPayload) {
  return {
    title: payload.title,
    startDate: payload.startDate,
    endDate: payload.endDate,
    allDay: payload.allDay,
    notes: payload.notes,
    recurrenceRule: mapRecurrenceRule(payload.recurrenceRule),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export class ExpoCalendarAdapter implements CalendarPort {
  async getPermissionStatus(): Promise<CalendarPermissionStatus> {
    const response = await getCalendarPermissionsAsync();
    return mapPermissionStatus(response.status);
  }

  async requestPermission(): Promise<CalendarPermissionStatus> {
    const response = await requestCalendarPermissionsAsync();
    return mapPermissionStatus(response.status);
  }

  async listWritableCalendars(): Promise<CalendarInfo[]> {
    const calendars = await getCalendarsAsync(EntityTypes.EVENT);
    return calendars
      .filter((calendar) => calendar.allowsModifications)
      .map((calendar) => ({
        id: calendar.id,
        title: calendar.title,
        isPrimary: calendar.isPrimary,
      }));
  }

  async getDefaultCalendarId(): Promise<string | null> {
    if (Platform.OS === 'ios') {
      const calendar = await getDefaultCalendarAsync();
      return calendar.id;
    }

    const calendars = await this.listWritableCalendars();
    const primary = calendars.find((calendar) => calendar.isPrimary);
    return primary?.id ?? calendars[0]?.id ?? null;
  }

  async createEvent(calendarId: string, payload: CalendarEventPayload): Promise<string> {
    return createEventAsync(calendarId, mapEventPayload(payload));
  }

  async updateEvent(eventId: string, payload: CalendarEventPayload): Promise<void> {
    await updateEventAsync(eventId, mapEventPayload(payload));
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await deleteEventAsync(eventId);
    } catch {
      // Event may already be removed by the user in the system calendar.
    }
  }

  async eventExists(eventId: string): Promise<boolean> {
    try {
      await getEventAsync(eventId);
      return true;
    } catch {
      return false;
    }
  }
}

export class NoopCalendarAdapter implements CalendarPort {
  async getPermissionStatus(): Promise<CalendarPermissionStatus> {
    return 'denied';
  }

  async requestPermission(): Promise<CalendarPermissionStatus> {
    return 'denied';
  }

  async listWritableCalendars(): Promise<CalendarInfo[]> {
    return [];
  }

  async getDefaultCalendarId(): Promise<string | null> {
    return null;
  }

  async createEvent(_calendarId: string, _payload: CalendarEventPayload): Promise<string> {
    throw new Error('Calendar sync is not available on this platform');
  }

  async updateEvent(_eventId: string, _payload: CalendarEventPayload): Promise<void> {}

  async deleteEvent(_eventId: string): Promise<void> {}

  async eventExists(_eventId: string): Promise<boolean> {
    return false;
  }
}

export function createCalendarPort(): CalendarPort {
  if (Platform.OS === 'web') {
    return new NoopCalendarAdapter();
  }
  return new ExpoCalendarAdapter();
}
