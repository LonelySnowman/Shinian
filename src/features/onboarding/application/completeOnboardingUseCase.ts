import type { PreferencesRepository } from '@/src/core/domain/ports/PreferencesRepository';
import { nowIso } from '@/src/core/utils/id';

export class CompleteOnboardingUseCase {
  constructor(private readonly preferencesRepository: PreferencesRepository) {}

  async execute(): Promise<void> {
    const preferences = await this.preferencesRepository.get();
    await this.preferencesRepository.save({
      ...preferences,
      hasOnboarded: true,
      updatedAt: nowIso(),
    });
  }
}
