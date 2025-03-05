import { Job } from './job';

export type HelloWorldParams = {
  name: string;
};

export class HelloWorldJob extends Job<HelloWorldParams> {
  public readonly queue = 'hello-world';
}
