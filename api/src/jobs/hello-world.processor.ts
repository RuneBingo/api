import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { HelloWorldParams } from './hello-world.job';

@Processor('hello-world')
export class HelloWorldProcessor extends WorkerHost {
  private readonly logger = new Logger(HelloWorldProcessor.name);

  // eslint-disable-next-line @typescript-eslint/require-await
  async process(job: Job<HelloWorldParams>): Promise<void> {
    this.logger.log(`Hello, ${job.data.name}!`);
  }
}
