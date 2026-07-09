import type { AnniversaryRepository } from '@/src/core/domain/ports/AnniversaryRepository';
import type { WidgetCacheRepository, WidgetPort } from '@/src/core/domain/ports/WidgetPort';
import { buildWidgetSnapshot } from '@/src/features/widget/domain/buildWidgetSnapshot';

export class RefreshWidgetsUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly widgetCacheRepository: WidgetCacheRepository,
    private readonly widgetPort: WidgetPort,
  ) {}

  async execute(): Promise<void> {
    const anniversaries = await this.anniversaryRepository.findAll({
      includeArchived: false,
      sortBy: 'date',
      sortDirection: 'asc',
    });

    const snapshot = buildWidgetSnapshot(anniversaries);
    await this.widgetCacheRepository.save(snapshot);

    if (this.widgetPort.isSupported()) {
      await this.widgetPort.refresh(snapshot);
    }
  }
}
