import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Queue } from 'bullmq';

import { Job } from './job';
import { CRON_JOBS, JOB_QUEUES, JobQueue } from './jobs.constants';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly queues: Map<JobQueue, Queue> = new Map();
  private readonly logger = new Logger(JobsService.name);

  constructor(private moduleRef: ModuleRef) {}

  perform<T extends object>(job: Job<T>) {
    const queue = this.queues.get(job.queue);
    if (!queue) {
      this.logger.error(`Queue "${job.queue}" not found`);
      return;
    }

    return queue.add(job.constructor.name, job.params);
  }

  async onModuleInit() {
    for (const queue of JOB_QUEUES) {
      this.queues.set(queue, this.moduleRef.get(`BullQueue_${queue}`, { strict: false }));
    }

    for (const { job, params, repeat } of CRON_JOBS) {
      const queue = this.queues.get(job);
      if (!queue) {
        this.logger.error(`Queue "${job}" not found`);
        continue;
      }

      try {
        const repeatableJobs = await queue.getJobSchedulers();
        await Promise.all(repeatableJobs.map(({ key }) => queue.removeJobScheduler(key)));

        await queue.add(job, params, { repeat });
        this.logger.log(`Scheduled cron job "${job}" with repeat pattern: ${JSON.stringify(repeat)}`);
      } catch (error) {
        this.logger.error(`Failed to schedule cron job "${job}":`, error);
      }
    }
  }
}
