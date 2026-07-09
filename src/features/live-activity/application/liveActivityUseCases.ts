import type { AnniversaryRepository } from '@/src/core/domain/ports/AnniversaryRepository';
import type { LiveActivityPort } from '@/src/core/domain/ports/LiveActivityPort';
import type { PreferencesRepository } from '@/src/core/domain/ports/PreferencesRepository';
import { nowIso } from '@/src/core/utils/id';
import {
  buildLiveActivityDeepLink,
  buildLiveActivityPayload,
} from '@/src/features/live-activity/domain/buildLiveActivityPayload';

export class StartAnniversaryLiveActivityUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly liveActivityPort: LiveActivityPort,
    private readonly preferencesRepository: PreferencesRepository,
  ) {}

  async execute(anniversaryId: string): Promise<void> {
    const anniversary = await this.anniversaryRepository.findById(anniversaryId);
    if (!anniversary || anniversary.archived) {
      throw new Error('无法为该纪念日开启 Live Activity');
    }

    if (!this.liveActivityPort.isSupported()) {
      throw new Error('当前平台不支持 Live Activity');
    }

    await this.liveActivityPort.end();
    const payload = buildLiveActivityPayload(anniversary);
    await this.liveActivityPort.start(payload);

    const preferences = await this.preferencesRepository.get();
    await this.preferencesRepository.save({
      ...preferences,
      activeLiveActivityAnniversaryId: anniversaryId,
      updatedAt: nowIso(),
    });
  }
}

export class UpdateAnniversaryLiveActivityUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly liveActivityPort: LiveActivityPort,
    private readonly preferencesRepository: PreferencesRepository,
  ) {}

  async execute(anniversaryId: string): Promise<void> {
    if (!this.liveActivityPort.isSupported()) {
      return;
    }

    const preferences = await this.preferencesRepository.get();
    if (preferences.activeLiveActivityAnniversaryId !== anniversaryId) {
      return;
    }

    const anniversary = await this.anniversaryRepository.findById(anniversaryId);
    if (!anniversary || anniversary.archived) {
      await this.endActive();
      return;
    }

    const payload = buildLiveActivityPayload(anniversary);
    const hasActive = await this.liveActivityPort.hasActiveActivity();
    if (hasActive) {
      await this.liveActivityPort.update(payload);
      return;
    }

    await this.liveActivityPort.start(payload);
  }

  async executeActive(): Promise<void> {
    const preferences = await this.preferencesRepository.get();
    if (!preferences.activeLiveActivityAnniversaryId) {
      return;
    }

    await this.execute(preferences.activeLiveActivityAnniversaryId);
  }

  private async endActive(): Promise<void> {
    await this.liveActivityPort.end();
    const preferences = await this.preferencesRepository.get();
    await this.preferencesRepository.save({
      ...preferences,
      activeLiveActivityAnniversaryId: undefined,
      updatedAt: nowIso(),
    });
  }
}

export class EndAnniversaryLiveActivityUseCase {
  constructor(
    private readonly liveActivityPort: LiveActivityPort,
    private readonly preferencesRepository: PreferencesRepository,
  ) {}

  async execute(): Promise<void> {
    await this.liveActivityPort.end();
    const preferences = await this.preferencesRepository.get();
    await this.preferencesRepository.save({
      ...preferences,
      activeLiveActivityAnniversaryId: undefined,
      updatedAt: nowIso(),
    });
  }

  async executeIfActive(anniversaryId: string): Promise<void> {
    const preferences = await this.preferencesRepository.get();
    if (preferences.activeLiveActivityAnniversaryId !== anniversaryId) {
      return;
    }

    await this.execute();
  }
}

export { buildLiveActivityDeepLink, buildLiveActivityPayload };
