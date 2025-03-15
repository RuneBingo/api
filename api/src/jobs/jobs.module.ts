import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HelloWorldProcessor } from './hello-world.processor';
import { JOB_QUEUES } from './jobs.constants';
import { JobsService } from './jobs.service';

@Module({
  imports: JOB_QUEUES.map((name) => BullModule.registerQueue({ name })),
  providers: [JobsService, HelloWorldProcessor],
  exports: [JobsService],
})
export class JobsModule {}
