import { ValidationError } from '@/class/errors';

export abstract class BaseService {
  protected requireNonEmpty(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError(`${fieldName} is required`);
    }
  }

  protected requireValidDateRange(startsAtIso: string, endsAtIso: string): void {
    const startsAt = new Date(startsAtIso).getTime();
    const endsAt = new Date(endsAtIso).getTime();

    if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) {
      throw new ValidationError('Invalid date format provided');
    }

    if (endsAt <= startsAt) {
      throw new ValidationError('Election end time must be after start time');
    }
  }
}
