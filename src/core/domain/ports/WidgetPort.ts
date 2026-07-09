export interface WidgetSnapshotItem {
  id: string;
  title: string;
  color: string;
  daysRemaining: number;
  primaryLabel: string;
  secondaryLabel: string;
  targetDateIso: string;
}

export interface WidgetSnapshotProps {
  version: number;
  generatedAt: string;
  items: WidgetSnapshotItem[];
}

export const EMPTY_WIDGET_SNAPSHOT: WidgetSnapshotProps = {
  version: 1,
  generatedAt: new Date(0).toISOString(),
  items: [],
};

export interface WidgetPort {
  isSupported(): boolean;
  refresh(snapshot: WidgetSnapshotProps): Promise<void>;
}

export interface WidgetCacheRepository {
  get(): Promise<WidgetSnapshotProps | null>;
  save(snapshot: WidgetSnapshotProps): Promise<void>;
}
