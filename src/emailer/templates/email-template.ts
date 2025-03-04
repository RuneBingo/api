export abstract class EmailTemplate<T = object> {
  constructor(
    public readonly to: string,
    public readonly context: T,
  ) {}

  public abstract subject: string;
  public abstract template: string;
}
