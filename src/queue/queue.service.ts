import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('tasks') private taskQueue: Queue) {}

  async enqueueTask(type: string, payload: Record<string, any>) {
    await this.taskQueue.add(type, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}