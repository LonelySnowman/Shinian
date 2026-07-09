export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface NotificationIntent {
  id: string;
  anniversaryId: string;
  title: string;
  body: string;
  triggerAt: Date;
  data: {
    anniversaryId: string;
    type: 'reminder';
  };
}

export interface NotificationPort {
  getPermissionStatus(): Promise<NotificationPermissionStatus>;
  requestPermission(): Promise<NotificationPermissionStatus>;
  schedule(intent: NotificationIntent): Promise<void>;
  cancel(id: string): Promise<void>;
  cancelMany(ids: string[]): Promise<void>;
  getPendingIds(): Promise<string[]>;
}
