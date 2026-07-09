export interface UserPreferences {
  hasOnboarded: boolean;
  theme: 'system' | 'light' | 'dark';
  calendarSyncEnabled: boolean;
  defaultRemindersEnabled: boolean;
  updatedAt: string;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  hasOnboarded: false,
  theme: 'system',
  calendarSyncEnabled: false,
  defaultRemindersEnabled: true,
  updatedAt: new Date(0).toISOString(),
};
