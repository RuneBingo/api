import type { I18nPath } from '@/i18n/types';

export abstract class EmailTemplate<T = object> {
  constructor(
    public readonly to: string,
    public readonly lang: string,
    public readonly context: T,
  ) {}

  public abstract subject: I18nPath;
  public abstract template: string;
}
