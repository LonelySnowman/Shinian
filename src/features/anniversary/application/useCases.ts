import type { EventBus } from '@/src/core/application/bus/EventBus';
import {
  applyAnniversaryUpdate,
  createAnniversaryEntity,
  type Anniversary,
  type CreateAnniversaryInput,
} from '@/src/core/domain/entities/Anniversary';
import { ValidationError } from '@/src/core/domain/errors/DomainError';
import type { AnniversaryRepository } from '@/src/core/domain/ports/AnniversaryRepository';
import { solarToLunarMeta } from '@/src/core/domain/value-objects/LunarDate';
import { createId, nowIso } from '@/src/core/utils/id';

export class CreateAnniversaryUseCase {
  constructor(
    private readonly repository: AnniversaryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: CreateAnniversaryInput): Promise<Anniversary> {
    if (!input.title.trim()) {
      throw new ValidationError('标题不能为空');
    }

    const now = nowIso();
    const lunarMeta =
      input.isLunar ? input.lunarMeta ?? solarToLunarMeta(input.date) : undefined;

    const anniversary = createAnniversaryEntity({
      ...input,
      id: createId(),
      now,
      lunarMeta,
    });

    await this.repository.save(anniversary);
    this.eventBus.publish({
      type: 'anniversary.created',
      payload: { id: anniversary.id },
      occurredAt: now,
    });

    return anniversary;
  }
}

export class UpdateAnniversaryUseCase {
  constructor(
    private readonly repository: AnniversaryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string, input: Parameters<typeof applyAnniversaryUpdate>[1]): Promise<Anniversary> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new ValidationError('纪念日不存在');
    }

    const now = nowIso();
    const nextInput = { ...input };

    if (input.isLunar && input.date && !input.lunarMeta) {
      nextInput.lunarMeta = solarToLunarMeta(input.date);
    }

    const updated = applyAnniversaryUpdate(existing, nextInput, now);
    await this.repository.save(updated);
    this.eventBus.publish({
      type: 'anniversary.updated',
      payload: { id },
      occurredAt: now,
    });

    return updated;
  }
}

export class DeleteAnniversaryUseCase {
  constructor(
    private readonly repository: AnniversaryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string): Promise<void> {
    const now = nowIso();
    await this.repository.delete(id);
    this.eventBus.publish({
      type: 'anniversary.deleted',
      payload: { id },
      occurredAt: now,
    });
  }
}

export class ArchiveAnniversaryUseCase {
  constructor(
    private readonly repository: AnniversaryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string): Promise<void> {
    const now = nowIso();
    await this.repository.archive(id, now);
    this.eventBus.publish({
      type: 'anniversary.archived',
      payload: { id },
      occurredAt: now,
    });
  }
}

export class RestoreAnniversaryUseCase {
  constructor(
    private readonly repository: AnniversaryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string): Promise<void> {
    const now = nowIso();
    await this.repository.restore(id);
    this.eventBus.publish({
      type: 'anniversary.restored',
      payload: { id },
      occurredAt: now,
    });
  }
}

export class GetAnniversariesUseCase {
  constructor(private readonly repository: AnniversaryRepository) {}

  execute(includeArchived = false): Promise<Anniversary[]> {
    return this.repository.findAll({
      includeArchived,
      sortBy: 'date',
      sortDirection: 'asc',
    });
  }
}

export class GetAnniversaryByIdUseCase {
  constructor(private readonly repository: AnniversaryRepository) {}

  execute(id: string): Promise<Anniversary | null> {
    return this.repository.findById(id);
  }
}
