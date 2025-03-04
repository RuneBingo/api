export abstract class EmailTemplate<T = object> {
  constructor(
    public readonly to: string,
    public readonly context: T,
  ) {}

  public abstract subject: string;
  public abstract template: string;

  public from: string = process.env.EMAIL_FROM || 'No Reply <default-email@gmail.com';
}
