import type { UserPreferences } from '../entities/UserPreferences';

export interface PreferencesRepository {
  get(): Promise<UserPreferences>;
  save(preferences: UserPreferences): Promise<void>;
}
