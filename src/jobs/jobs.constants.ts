import { type RepeatOptions } from 'bullmq';

export const JOB_QUEUES = [
  // Add your job queues here
  'hello-world',
] as const;

export type JobQueue = (typeof JOB_QUEUES)[number];

export const CRON_JOBS = [
  // Schedule cron jobs here
  {
    job: 'hello-world',
    params: { name: 'Developer console' },
    repeat: { pattern: '*/5 * * * * *' },
  },
] as const satisfies { job: JobQueue; params: object; repeat: RepeatOptions }[];
