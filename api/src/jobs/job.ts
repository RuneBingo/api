import { type JobQueue } from './jobs.constants';

export abstract class Job<T extends object> {
  public abstract queue: JobQueue;

  constructor(public readonly params: T) {}
}
