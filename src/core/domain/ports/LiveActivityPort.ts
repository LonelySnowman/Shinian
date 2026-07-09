export interface LiveActivityPayload {
  anniversaryId: string;
  title: string;
  color: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export interface LiveActivityPort {
  isSupported(): boolean;
  start(payload: LiveActivityPayload): Promise<void>;
  update(payload: LiveActivityPayload): Promise<void>;
  end(): Promise<void>;
  hasActiveActivity(): Promise<boolean>;
}
